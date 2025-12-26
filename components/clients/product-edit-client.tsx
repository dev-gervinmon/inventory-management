"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StickyFormHeader from "@/components/layout/sticky-form-header";
import ProductInfoSidebar from "@/components/layout/product-info-sidebar";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import SuccessModal from "@/components/modals/success-modal";
import { useMessage } from "@/lib/hooks/useMessage";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import MessageBanner from "@/components/common/message-banner";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import { UI_TIMING } from "@/lib/constants/forms";
import ProductActivityTimeline from "@/components/activity-timeline/product-activity-timeline";
import type { Activity } from "@/lib/types/activities";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku: string | null;
  lowStockAt: number | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories: Array<{ id: string }>;
  subcategories: Array<{ id: string }>;
}

interface ProductEditClientProps {
  product: Product;
  formAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (id: string) => Promise<{ success: boolean }>;
  activities: Activity[];
  children: React.ReactNode;
}

/**
 * Client-side wrapper for editing existing products
 *
 * This component manages the entire product edit flow on the client:
 * - Dirty state tracking for unsaved changes
 * - Navigation blocking with confirmation when form is dirty
 * - Delete confirmation modal with separate action handler
 * - Success modal with auto-close
 * - Form reset and validation
 * - Sticky form header with submit button
 * - Context provision for nested form components
 * - Warning before page unload if form has unsaved changes
 *
 * @component
 * @example
 * // In app/inventory/[id]/edit-product/page.tsx (server component)
 * import { editProduct, deleteProduct } from '@/lib/actions/products';
 * import ProductEditClient from '@/components/clients/product-edit-client';
 * import ProductForm from '@/components/forms/product-form';
 *
 * export default async function EditProductPage({ params }) {
 *   const product = await getProduct(params.id);
 *   return (
 *     <ProductEditClient
 *       product={product}
 *       formAction={editProduct}
 *       deleteAction={deleteProduct}
 *     >
 *       <ProductForm product={product} />
 *     </ProductEditClient>
 *   );
 * }
 *
 * @param {Product} product - The product data to edit
 * @param {Function} formAction - Server action to handle product updates
 * @param {Function} deleteAction - Server action to handle product deletion
 * @param {React.ReactNode} children - Form content to render inside the edit client
 */
export default function ProductEditClient({
  product,
  formAction,
  deleteAction,
  activities,
  children,
}: ProductEditClientProps) {
  const router = useRouter();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 5000,
  });
  const { errors: formErrors, clearErrors: clearFormErrors } = useFormErrors();

  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track form changes
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;
    formRef.current = form;

    const handleFormChange = (e: Event) => {
      // Only mark as dirty if the change comes from actual form inputs, not other elements
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        setIsDirty(true);
      }
    };

    form.addEventListener("change", handleFormChange);
    form.addEventListener("input", handleFormChange);

    return () => {
      form.removeEventListener("change", handleFormChange);
      form.removeEventListener("input", handleFormChange);
    };
  }, []);

  // Warn on page reload/close if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    clearMessage();

    try {
      await deleteAction(product.id);
      showSuccess("Product deleted successfully");
      sessionStorage.setItem("deletedProductId", product.id);
      setTimeout(() => {
        router.push("/inventory");
        router.refresh();
      }, UI_TIMING.DELETE_REDIRECT_DELAY_MS);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
      setIsDeletingOpen(false);
    }
  };

  const handleDiscardChanges = () => {
    setIsNavigationBlocked(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  const handleKeepEditing = () => {
    setIsNavigationBlocked(false);
    setPendingNavigation(null);
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setIsDirty(false);
      clearFormErrors();
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    clearFormErrors();
    setIsSubmitting(true);

    try {
      await formAction(formData);
      // redirect() throws, so we shouldn't reach here - but kept as fallback
      setIsDirty(false);
      triggerSuccessFlow();
    } catch (error) {
      // Next.js redirect throws with name 'NEXT_REDIRECT' - this means success!
      if (
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" || error.name === "RedirectError")
      ) {
        setIsDirty(false);
        triggerSuccessFlow();
        return;
      }

      // Handle actual errors
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      showError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const triggerSuccessFlow = () => {
    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
    // Auto-close modal after 2.5 seconds
    successTimeoutRef.current = setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 2500);
  };

  const handleSuccessModalClose = () => {
    // Clear the timeout if user closes manually
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setIsSuccessModalOpen(false);
  };
  return (
    <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-6">
      <MessageBanner message={message} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Product Saved"
        subtitle="Your changes have been successfully saved."
        onClose={handleSuccessModalClose}
      />

      <StickyFormHeader
        title="Edit Product"
        subtitle={`${product.name} • Product ID: ${product.id}`}
        backHref="/inventory"
        backLabel="← Back to Inventory"
        isDirty={isDirty}
        isLoading={isSubmitting}
        onReset={handleReset}
      />

      {/* Add padding for sticky header - responsive */}
      <div className="pt-6 sm:pt-8 md:pt-20" />

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
              <ProductFormContext.Provider
                value={{ formErrors, isSubmitting, onSubmit: handleFormSubmit }}
              >
                {children}
              </ProductFormContext.Provider>
            </div>

            {/* Product Activity Timeline */}
            {activities.length > 0 && (
              <ProductActivityTimeline
                activities={activities}
                productId={product.id}
              />
            )}
          </div>

          {/* Right Column: Info Sidebar */}
          <ProductInfoSidebar
            productId={product.id}
            sku={product.sku}
            price={product.price}
            quantity={product.quantity}
            lowStockAt={product.lowStockAt}
            createdAt={product.createdAt}
            updatedAt={product.updatedAt}
            onDelete={() => setIsDeletingOpen(true)}
            isDeleting={isDeleting}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeletingOpen}
        onClose={() => setIsDeletingOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />

      {/* Unsaved Changes Warning Modal */}
      <ConfirmationModal
        isOpen={isNavigationBlocked}
        onClose={handleKeepEditing}
        onConfirm={handleDiscardChanges}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to leave without saving?"
        confirmLabel="Discard Changes"
        isLoading={false}
      />
    </div>
  );
}
