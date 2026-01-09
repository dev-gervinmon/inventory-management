"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedProduct } from "@/app/src/utils/product";
import type { CategoryWithSubcategories } from "@/lib/types/category";
import { createProduct, editProduct } from "@/lib/actions/products";
import { getEditProductPath } from "@/lib/constants/forms";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import { useMessage } from "@/lib/hooks/useMessage";
import MessageBanner from "@/components/common/message-banner";
import { Button } from "@/components/buttons/button";
import FormButton from "@/components/buttons/form-button";
import ProductForm from "@/components/forms/product-form";
import Tabs, { TabPanel } from "@/components/common/tabs";
import ProductActivityTimeline from "@/components/activity-timeline/product-activity-timeline";
import ProductInfoSidebar from "@/components/layout/product-info-sidebar";
import type { Activity } from "@/lib/types/activities";

interface ProductDrawerProps {
  isOpen: boolean;
  mode: "create" | "edit";
  product: SerializedProduct | null;
  categories: CategoryWithSubcategories[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductDrawer({
  isOpen,
  mode,
  product,
  categories,
  onClose,
  onSaved,
}: ProductDrawerProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const productId = product?.id ?? null;
  const activitiesCacheRef = useRef<Map<string, Activity[]>>(new Map());
  const activitiesLastFetchAtRef = useRef<Map<string, number>>(new Map());
  const activitiesRequestRef = useRef<{
    productId: string;
    controller: AbortController;
  } | null>(null);

  const ACTIVITIES_CACHE_TTL_MS = 15_000;

  const {
    errors: formErrors,
    clearErrors: clearFormErrors,
    clearFieldError,
    setAllErrors: setAllFormErrors,
  } = useFormErrors();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 3500,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidationBannerActive, setIsValidationBannerActive] =
    useState(false);

  const [activeDrawerTab, setActiveDrawerTab] = useState<
    "form" | "details" | "activity"
  >("form");
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activitiesReloadToken, setActivitiesReloadToken] = useState(0);

  const title = mode === "create" ? "Add Product" : "Edit Product";
  const primaryActionLabel = isSubmitting
    ? "Saving..."
    : mode === "create"
    ? "Create"
    : "Save";

  const initialValues = useMemo(() => {
    if (mode !== "edit" || !product) return null;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      unitCost: product.unitCost,
      quantity: product.quantity,
      sku: product.sku,
      lowStockAt: product.lowStockAt,
      image: product.imageUrl,
      categoryIds: (product.categories ?? []).map((c) => c.id),
      subcategoryIds: (product.subcategories ?? []).map((s) => s.id),
    };
  }, [mode, product]);

  const drawerTabs = useMemo(
    () => [
      { id: "form", label: "Form" },
      { id: "details", label: "Details" },
      { id: "activity", label: "Activity" },
    ],
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    setActiveDrawerTab("form");
    setActivities(null);
    setActivitiesError(null);
    setIsLoadingActivities(false);
  }, [isOpen, mode, productId]);

  useEffect(() => {
    if (!isOpen) return;
    if (mode !== "edit" || !productId) return;
    if (activeDrawerTab !== "activity") return;

    // Serve cached data immediately (if present), then revalidate when stale.
    const cached = activitiesCacheRef.current.get(productId);
    if (cached) setActivities(cached);

    const lastFetchedAt = activitiesLastFetchAtRef.current.get(productId) ?? 0;
    const isStale =
      !cached || Date.now() - lastFetchedAt > ACTIVITIES_CACHE_TTL_MS;
    if (!isStale) return;

    // If there's already an in-flight request for this product, don't start another.
    const inflight = activitiesRequestRef.current;
    if (inflight?.productId === productId) return;

    // Clear any previous error before attempting a fresh load.
    setActivitiesError(null);

    const controller = new AbortController();
    activitiesRequestRef.current = { productId, controller };

    (async () => {
      try {
        setIsLoadingActivities(true);
        const res = await fetch("/api/activities", {
          method: "GET",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to load activities (${res.status})`);
        }

        const data = (await res.json()) as Activity[];

        // Cache and publish
        activitiesCacheRef.current.set(productId, data);
        activitiesLastFetchAtRef.current.set(productId, Date.now());
        setActivities(data);
        setActivitiesError(null);
      } catch (e) {
        const maybeName =
          e instanceof Error
            ? e.name
            : e &&
              typeof e === "object" &&
              "name" in e &&
              typeof (e as { name?: unknown }).name === "string"
            ? (e as { name: string }).name
            : "";
        if (maybeName === "AbortError") return;
        const msg =
          e instanceof Error ? e.message : "Failed to load activities";
        setActivitiesError(msg);
      } finally {
        setIsLoadingActivities(false);
        if (activitiesRequestRef.current?.productId === productId) {
          activitiesRequestRef.current = null;
        }
      }
    })();

    return () => {
      controller.abort();
      if (activitiesRequestRef.current?.productId === productId) {
        activitiesRequestRef.current = null;
      }
    };
  }, [isOpen, mode, activeDrawerTab, productId, activitiesReloadToken]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Capture the form inside the drawer (avoid querying the whole document)
  useEffect(() => {
    if (!isOpen) return;
    const form = panelRef.current?.querySelector(
      "form#product-form"
    ) as HTMLFormElement | null;
    formRef.current = form;
  }, [isOpen, mode, product?.id]);

  const handleClose = () => {
    if (isSubmitting) return;
    clearMessage();
    clearFormErrors();
    setIsValidationBannerActive(false);
    setIsSubmitting(false);
    setActiveDrawerTab("form");
    onClose();
  };

  const hasUnsavedChanges = () => {
    if (mode !== "edit" || !product || !initialValues) return false;
    const form = formRef.current;
    if (!form) return false;

    const data = new FormData(form);

    const normalizeText = (value: unknown) => String(value ?? "").trim();

    const numericEqual = (key: string, initial: number | null | undefined) => {
      const raw = normalizeText(data.get(key));
      if (raw === "") return initial === null || initial === undefined;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) return false;
      if (initial === null || initial === undefined) return false;
      return Math.abs(parsed - Number(initial)) < 1e-9;
    };

    const textEqual = (key: string, initial: string | null | undefined) => {
      return normalizeText(data.get(key)) === normalizeText(initial);
    };

    const listEqual = (key: string, initial: string[] | null | undefined) => {
      const next = data
        .getAll(key)
        .map((v) => String(v))
        .filter(Boolean)
        .sort();
      const prev = (initial ?? []).slice().sort();

      if (next.length !== prev.length) return false;
      for (let i = 0; i < next.length; i++) {
        if (next[i] !== prev[i]) return false;
      }
      return true;
    };

    // Basic fields
    if (!textEqual("name", initialValues.name)) return true;
    if (!numericEqual("price", initialValues.price)) return true;
    if (!numericEqual("quantity", initialValues.quantity)) return true;

    // Optional fields
    if (!numericEqual("unitCost", initialValues.unitCost)) return true;
    if (!textEqual("sku", initialValues.sku)) return true;
    if (!numericEqual("lowStockAt", initialValues.lowStockAt)) return true;
    if (!textEqual("image", initialValues.image)) return true;

    // Multi-selects (hidden inputs)
    if (!listEqual("categoryIds", initialValues.categoryIds)) return true;
    if (!listEqual("subcategoryIds", initialValues.subcategoryIds)) return true;

    return false;
  };

  const handleOpenFullPageEdit = () => {
    if (isSubmitting) return;
    if (mode !== "edit" || !product) return;

    if (hasUnsavedChanges()) {
      const shouldLeave = window.confirm(
        "You have unsaved changes in the drawer. Open the full edit page and discard them?"
      );
      if (!shouldLeave) return;
    }

    router.push(getEditProductPath(product.id));
    handleClose();
  };

  const maybeClearValidationBanner = () => {
    if (!isValidationBannerActive) return;
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const priceRaw = String(data.get("price") ?? "").trim();
    const quantityRaw = String(data.get("quantity") ?? "").trim();

    if (name && priceRaw && quantityRaw) {
      clearMessage();
      setIsValidationBannerActive(false);
    }
  };

  const handleSubmitRequest = () => {
    if (isSubmitting) return;
    formRef.current?.requestSubmit();
  };

  const handleFormSubmit = async (formData: FormData) => {
    clearMessage();
    clearFormErrors();
    setIsValidationBannerActive(false);

    const name = String(formData.get("name") ?? "").trim();
    const priceRaw = String(formData.get("price") ?? "").trim();
    const quantityRaw = String(formData.get("quantity") ?? "").trim();

    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.name = "Name is required";
    if (!priceRaw) nextErrors.price = "Price is required";
    if (!quantityRaw) nextErrors.quantity = "Quantity is required";

    // Basic numeric sanity (keep it minimal; server still validates too)
    const price = priceRaw ? Number(priceRaw) : NaN;
    const quantity = quantityRaw ? Number(quantityRaw) : NaN;

    if (priceRaw && (!Number.isFinite(price) || price < 0)) {
      nextErrors.price = "Price must be non-negative";
    }

    if (quantityRaw && (!Number.isFinite(quantity) || quantity < 0)) {
      nextErrors.quantity = "Quantity must be non-negative";
    }

    if (Object.keys(nextErrors).length > 0) {
      setAllFormErrors(nextErrors);
      showError("Please fill in the required fields");
      setIsValidationBannerActive(true);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createProduct(formData);
        showSuccess("Product created");
      } else {
        await editProduct(formData);
        showSuccess("Product saved");
      }

      // Invalidate activity cache so the Activity tab reflects new actions
      // without requiring a full page refresh.
      if (mode === "edit" && productId) {
        activitiesCacheRef.current.delete(productId);
        activitiesLastFetchAtRef.current.delete(productId);
        setActivities(null);
        setActivitiesError(null);

        if (activeDrawerTab === "activity") {
          setActivitiesReloadToken((t) => t + 1);
        }
      }

      setIsValidationBannerActive(false);

      // Ensure server data stays in sync
      router.refresh();
      setIsSubmitting(false);

      // Give the user a moment to see the success banner before closing.
      window.setTimeout(() => {
        clearMessage();
        clearFormErrors();
        onSaved();
      }, 600);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Something went wrong";
      showError(msg);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // If user opens edit drawer but product isn't available in current list, close gracefully.
  if (mode === "edit" && !product) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-60"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-(--top-nav-height) bottom-0 z-70 w-full max-w-2xl bg-glass border-l border-(--border-subtle) shadow-2xl transform transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-(--border-subtle) bg-glass">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-(--text-primary)">
                {title}
              </h2>
              {mode === "edit" && product && (
                <p className="text-xs sm:text-sm text-(--text-muted) mt-0.5 truncate">
                  {product.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {mode === "edit" && product && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleOpenFullPageEdit}
                  className="rounded-lg whitespace-nowrap"
                  title="Open the full edit page (history, activity, revert)"
                  aria-label="Open full edit page"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit in full page</span>
                  <span className="sm:hidden">Full page</span>
                </Button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-1 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-elevated)/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content (scrolls) */}
          <div className="flex-1 overflow-y-auto modern-scrollbar px-5 sm:px-6 py-5">
            <div className="space-y-4">
              <MessageBanner message={message} />

              <Tabs
                tabs={drawerTabs}
                activeTab={activeDrawerTab}
                sticky={false}
                onTabChange={(tabId) =>
                  setActiveDrawerTab(tabId as "form" | "details" | "activity")
                }
              >
                <TabPanel tabId="form">
                  <ProductFormContext.Provider
                    value={{
                      formErrors,
                      isSubmitting,
                      onSubmit: handleFormSubmit,
                      clearFieldError,
                      onFieldChange: () => {
                        // Only auto-dismiss the banner for the local validation message.
                        maybeClearValidationBanner();
                      },
                    }}
                  >
                    <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5">
                      <ProductForm
                        id={initialValues?.id}
                        name={initialValues?.name}
                        price={initialValues?.price}
                        unitCost={initialValues?.unitCost}
                        quantity={initialValues?.quantity}
                        sku={initialValues?.sku}
                        lowStockAt={initialValues?.lowStockAt}
                        image={initialValues?.image}
                        categoryIds={initialValues?.categoryIds}
                        subcategoryIds={initialValues?.subcategoryIds}
                        categories={categories}
                      />
                    </div>
                  </ProductFormContext.Provider>
                </TabPanel>

                <TabPanel tabId="details">
                  {mode === "edit" && product && (
                    <ProductInfoSidebar
                      productId={product.id}
                      sku={product.sku}
                      price={product.price}
                      unitCost={product.unitCost}
                      quantity={product.quantity}
                      lowStockAt={product.lowStockAt}
                      createdAt={product.createdAt}
                      updatedAt={product.updatedAt}
                    />
                  )}
                </TabPanel>

                <TabPanel tabId="activity">
                  {mode === "edit" && product && (
                    <div className="space-y-3">
                      {isLoadingActivities && (
                        <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5 text-sm text-(--text-muted)">
                          Loading activity…
                        </div>
                      )}

                      {activitiesError && (
                        <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5 text-sm text-(--danger)">
                          {activitiesError}
                        </div>
                      )}

                      {activities &&
                        !isLoadingActivities &&
                        !activitiesError && (
                          <ProductActivityTimeline
                            activities={activities}
                            productId={product.id}
                            defaultExpanded
                          />
                        )}

                      {!activities &&
                        !isLoadingActivities &&
                        !activitiesError && (
                          <div className="rounded-2xl border border-(--border-strong) bg-(--surface-elevated)/10 p-4 sm:p-5 text-sm text-(--text-muted)">
                            Open this tab to load activity.
                          </div>
                        )}
                    </div>
                  )}
                </TabPanel>
              </Tabs>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-(--border-subtle) bg-glass px-5 sm:px-6 py-4">
            <div className="flex gap-3">
              <FormButton
                type="button"
                label={primaryActionLabel}
                disabled={isSubmitting}
                onClick={handleSubmitRequest}
                className="flex-1"
              />
              <FormButton
                type="button"
                label="Close"
                variant="secondary"
                disabled={isSubmitting}
                onClick={handleClose}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
