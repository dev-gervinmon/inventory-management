"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import MessageBanner from "@/components/common/message-banner";
import FormButton from "@/components/buttons/form-button";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import CategoryForm from "@/components/forms/category-form";
import { useMessage } from "@/lib/hooks/useMessage";
import { UI_TIMING } from "@/lib/constants/forms";
import { editCategory, deleteCategory } from "@/lib/actions/categories";
import {
  createSubcategory,
  deleteSubcategory,
  editSubcategory,
} from "@/lib/actions/subcategories";

export type DrawerSubcategory = {
  id: string;
  name: string;
  createdAt: Date;
  categoryId: string;
};

export type DrawerCategory = {
  id: string;
  name: string;
  createdAt: Date;
  subcategories: DrawerSubcategory[];
  _count: { products: number };
};

type CategoryDrawerMode = "create" | "edit";

interface CategoryDrawerProps {
  isOpen: boolean;
  mode: CategoryDrawerMode;
  category: DrawerCategory | null;
  onClose: () => void;
  onCategoriesChange: (
    updater: (prev: DrawerCategory[]) => DrawerCategory[]
  ) => void;
}

export default function CategoryDrawer({
  isOpen,
  mode,
  category,
  onClose,
  onCategoriesChange,
}: CategoryDrawerProps) {
  // Client-only guard for portal rendering (prevents document access during SSR).
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const { message, showError, showSuccess, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_TIMING.MESSAGE_TIMEOUT_MS,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<
    string | null
  >(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState("");

  const [confirmDeleteCategoryOpen, setConfirmDeleteCategoryOpen] =
    useState(false);
  const [confirmDeleteSubcategoryId, setConfirmDeleteSubcategoryId] = useState<
    string | null
  >(null);

  const activeCategoryId = mode === "edit" ? category?.id ?? null : null;

  const activeSubcategories = useMemo(() => {
    if (mode !== "edit" || !category) return [];
    return category.subcategories ?? [];
  }, [mode, category]);

  // Keep local input state in sync when switching between categories.
  useEffect(() => {
    if (!isOpen) return;
    clearMessage();
    setIsSubmitting(false);

    if (mode === "edit" && category) {
      setCategoryName(category.name);
    } else {
      setCategoryName("");
    }

    setNewSubcategoryName("");
    setEditingSubcategoryId(null);
    setEditingSubcategoryName("");
    setConfirmDeleteCategoryOpen(false);
    setConfirmDeleteSubcategoryId(null);
  }, [isOpen, mode, category, clearMessage]);

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

  const handleClose = () => {
    if (isSubmitting) return;
    clearMessage();
    onClose();
  };

  const handleSaveCategory = async () => {
    if (mode !== "edit" || !category) return;

    const next = categoryName.trim();
    if (!next) {
      showError("Category name is required");
      return;
    }

    if (next === category.name) {
      showError("No changes made");
      return;
    }

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", next);

      const res = await editCategory(formData);
      if (!res.success) {
        showError(res.error || "Failed to update category");
        setIsSubmitting(false);
        return;
      }

      onCategoriesChange((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, name: next } : c))
      );

      showSuccess("Category updated successfully!");
      router.refresh();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (mode !== "edit" || !category) return;

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", category.id);
      const res = await deleteCategory(formData);

      if (!res.success) {
        showError(res.error || "Failed to delete category");
        setIsSubmitting(false);
        return;
      }

      onCategoriesChange((prev) => prev.filter((c) => c.id !== category.id));
      showSuccess("Category deleted");
      setConfirmDeleteCategoryOpen(false);
      router.refresh();

      // Give the user a beat to see the success state
      window.setTimeout(() => {
        handleClose();
      }, 400);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!activeCategoryId) return;

    const name = newSubcategoryName.trim();
    if (!name) {
      showError("Subcategory name is required");
      return;
    }

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", activeCategoryId);

      const res = await createSubcategory(formData);
      if (!res?.success) {
        showError(res?.error || "Failed to add subcategory");
        setIsSubmitting(false);
        return;
      }

      // If the server action returned data, update optimistically. Otherwise, fall back to refresh.
      const created = (res as unknown as { data?: DrawerSubcategory }).data;
      if (created) {
        onCategoriesChange((prev) =>
          prev.map((c) =>
            c.id === activeCategoryId
              ? { ...c, subcategories: [created, ...(c.subcategories ?? [])] }
              : c
          )
        );
      } else {
        router.refresh();
      }

      setNewSubcategoryName("");
      showSuccess("Subcategory added");
    } catch (e) {
      showError(e instanceof Error ? e.message : "Failed to add subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditSubcategory = (sub: DrawerSubcategory) => {
    setEditingSubcategoryId(sub.id);
    setEditingSubcategoryName(sub.name);
    clearMessage();
  };

  const cancelEditSubcategory = () => {
    setEditingSubcategoryId(null);
    setEditingSubcategoryName("");
    clearMessage();
  };

  const handleSaveSubcategory = async () => {
    if (!activeCategoryId || !editingSubcategoryId) return;

    const next = editingSubcategoryName.trim();
    if (!next) {
      showError("Subcategory name is required");
      return;
    }

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", editingSubcategoryId);
      formData.append("name", next);
      formData.append("categoryId", activeCategoryId);

      const res = await editSubcategory(formData);
      if (!res?.success) {
        showError(res?.error || "Failed to update subcategory");
        setIsSubmitting(false);
        return;
      }

      onCategoriesChange((prev) =>
        prev.map((c) =>
          c.id === activeCategoryId
            ? {
                ...c,
                subcategories: (c.subcategories ?? []).map((s) =>
                  s.id === editingSubcategoryId ? { ...s, name: next } : s
                ),
              }
            : c
        )
      );

      cancelEditSubcategory();
      showSuccess("Subcategory updated");
      router.refresh();
    } catch (e) {
      showError(
        e instanceof Error ? e.message : "Failed to update subcategory"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteSubcategory = async () => {
    if (!activeCategoryId || !confirmDeleteSubcategoryId) return;

    setIsSubmitting(true);
    clearMessage();

    try {
      const formData = new FormData();
      formData.append("id", confirmDeleteSubcategoryId);
      formData.append("categoryId", activeCategoryId);

      const res = await deleteSubcategory(formData);
      if (!res.success) {
        showError(res.error || "Failed to delete subcategory");
        setIsSubmitting(false);
        return;
      }

      onCategoriesChange((prev) =>
        prev.map((c) =>
          c.id === activeCategoryId
            ? {
                ...c,
                subcategories: (c.subcategories ?? []).filter(
                  (s) => s.id !== confirmDeleteSubcategoryId
                ),
              }
            : c
        )
      );

      setConfirmDeleteSubcategoryId(null);
      showSuccess("Subcategory deleted");
      router.refresh();
    } catch (e) {
      showError(
        e instanceof Error ? e.message : "Failed to delete subcategory"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;
  if (!isClient) return null;

  if (mode === "edit" && !category) return null;

  const title = mode === "create" ? "Add Category" : "Edit Category";

  const drawerUi = (
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
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-(--border-subtle)">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-(--text-primary) truncate">
                {title}
              </h2>
              {mode === "edit" && category ? (
                <p className="text-xs sm:text-sm text-(--text-muted) truncate">
                  Manage category details and subcategories
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-(--text-muted)">
                  Create a new category
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl p-2 text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-elevated)/70 ring-1 ring-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 disabled:opacity-60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <MessageBanner message={message} />

            {mode === "create" ? (
              <div className="bg-(--surface-elevated)/10 border border-(--border-subtle) rounded-2xl p-4">
                <CategoryForm
                  onCreated={(created) => {
                    onCategoriesChange((prev) => [
                      created as DrawerCategory,
                      ...prev,
                    ]);
                  }}
                  onSuccess={() => {
                    router.refresh();
                    window.setTimeout(() => {
                      handleClose();
                    }, 400);
                  }}
                />
              </div>
            ) : (
              <>
                {/* Category details */}
                <section className="bg-(--surface-elevated)/10 border border-(--border-subtle) rounded-2xl p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-(--text-primary)">
                    Details
                  </h3>

                  <div>
                    <label
                      htmlFor="category-name"
                      className="block text-xs sm:text-sm font-medium text-(--text-secondary) mb-2"
                    >
                      Category Name *
                    </label>
                    <input
                      id="category-name"
                      type="text"
                      value={categoryName}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                        clearMessage();
                      }}
                      className="w-full px-4 py-3 rounded-xl text-sm transition bg-(--surface-elevated)/30 text-(--text-primary) placeholder:text-(--text-muted) border border-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:border-(--border-strong)"
                      placeholder="Enter category name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex gap-2">
                    <FormButton
                      type="button"
                      label={isSubmitting ? "Saving..." : "Save"}
                      variant="primary"
                      onClick={handleSaveCategory}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    <FormButton
                      type="button"
                      label="Delete"
                      variant="delete"
                      onClick={() => setConfirmDeleteCategoryOpen(true)}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                  </div>
                </section>

                {/* Subcategories */}
                <section className="bg-(--surface-elevated)/10 border border-(--border-subtle) rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-(--text-primary)">
                      Subcategories ({activeSubcategories.length})
                    </h3>
                  </div>

                  {/* Add subcategory */}
                  <div className="space-y-2">
                    <label
                      htmlFor="new-subcategory"
                      className="block text-xs sm:text-sm font-medium text-(--text-secondary)"
                    >
                      Add Subcategory
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="new-subcategory"
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => {
                          setNewSubcategoryName(e.target.value);
                          clearMessage();
                        }}
                        className="flex-1 px-4 py-3 rounded-xl text-sm transition bg-(--surface-elevated)/30 text-(--text-primary) placeholder:text-(--text-muted) border border-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:border-(--border-strong)"
                        placeholder="e.g., Winter Jackets"
                        disabled={isSubmitting}
                      />
                      <FormButton
                        type="button"
                        label={isSubmitting ? "Adding..." : "Add"}
                        variant="secondary"
                        onClick={handleAddSubcategory}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Existing subcategories */}
                  {activeSubcategories.length === 0 ? (
                    <div className="text-sm text-(--text-muted) py-3">
                      No subcategories yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-(--border-subtle) rounded-xl border border-(--border-subtle) overflow-hidden">
                      {activeSubcategories.map((sub) => {
                        const isEditing = editingSubcategoryId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            className="p-3 flex items-center gap-2 bg-(--surface-elevated)/20"
                          >
                            <div className="min-w-0 flex-1">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingSubcategoryName}
                                  onChange={(e) => {
                                    setEditingSubcategoryName(e.target.value);
                                    clearMessage();
                                  }}
                                  className="w-full px-3 py-2 rounded-lg text-sm transition bg-(--surface-elevated)/30 text-(--text-primary) placeholder:text-(--text-muted) border border-(--border-subtle) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)/40 focus-visible:border-(--border-strong)"
                                  disabled={isSubmitting}
                                />
                              ) : (
                                <div className="text-sm text-(--text-primary) truncate">
                                  {sub.name}
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <>
                                <FormButton
                                  type="button"
                                  size="sm"
                                  variant="primary"
                                  label="Save"
                                  onClick={handleSaveSubcategory}
                                  disabled={isSubmitting}
                                />
                                <FormButton
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  label="Cancel"
                                  onClick={cancelEditSubcategory}
                                  disabled={isSubmitting}
                                />
                              </>
                            ) : (
                              <>
                                <FormButton
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  label="Edit"
                                  onClick={() => startEditSubcategory(sub)}
                                  disabled={isSubmitting}
                                />
                                <FormButton
                                  type="button"
                                  size="sm"
                                  variant="delete"
                                  label="Delete"
                                  onClick={() =>
                                    setConfirmDeleteSubcategoryId(sub.id)
                                  }
                                  disabled={isSubmitting}
                                />
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmDeleteCategoryOpen}
        onClose={() => setConfirmDeleteCategoryOpen(false)}
        onConfirm={handleConfirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${
          category?.name ?? ""
        }"? All subcategories will also be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={!!confirmDeleteSubcategoryId}
        onClose={() => setConfirmDeleteSubcategoryId(null)}
        onConfirm={handleConfirmDeleteSubcategory}
        title="Delete Subcategory"
        message="Are you sure you want to delete this subcategory?"
        confirmLabel="Delete"
        isLoading={isSubmitting}
      />
    </>
  );

  return createPortal(drawerUi, document.body);
}
