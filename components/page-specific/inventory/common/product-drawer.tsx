"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SerializedProduct } from "@/app/src/utils/product";
import type { CategoryWithSubcategories } from "@/lib/types/category";
import { createProduct, editProduct } from "@/lib/actions/products";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import { useMessage } from "@/lib/hooks/useMessage";
import MessageBanner from "@/components/common/message-banner";
import FormButton from "@/components/buttons/form-button";
import ProductForm from "@/components/forms/product-form";

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

  const { errors: formErrors, clearErrors: clearFormErrors } = useFormErrors();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 3500,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    onClose();
  };

  const handleSubmitRequest = () => {
    if (isSubmitting) return;
    formRef.current?.requestSubmit();
  };

  const handleFormSubmit = async (formData: FormData) => {
    clearMessage();
    clearFormErrors();
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        await createProduct(formData);
        showSuccess("Product created");
      } else {
        await editProduct(formData);
        showSuccess("Product saved");
      }

      // Ensure server data stays in sync
      router.refresh();
      onSaved();
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
        className="fixed inset-0 bg-black/30 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-glass border-l border-(--border-subtle) shadow-2xl transform transition-transform duration-300 ease-out"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-(--border-subtle) bg-glass">
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

          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-elevated)/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto modern-scrollbar px-5 sm:px-6 py-5 pb-28">
          <MessageBanner message={message} />

          <ProductFormContext.Provider
            value={{
              formErrors,
              isSubmitting,
              onSubmit: handleFormSubmit,
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
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-(--border-subtle) bg-glass px-5 sm:px-6 py-4">
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
    </>
  );
}
