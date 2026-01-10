"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "@/components/forms/add-product-form";
import ProductFormSidebar from "@/components/forms/product-form-sidebar";
import StickyFormHeader from "@/components/layout/sticky-form-header";
import { useMessage } from "@/lib/hooks/useMessage";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import SuccessModal from "@/components/modals/success-modal";
import MessageBanner from "@/components/common/message-banner";
import { CategoryWithSubcategories } from "@/lib/types/category";
import { UI_TIMING, getEditProductPath } from "@/lib/constants/forms";

interface AddProductClientProps {
  formAction: (
    formData: FormData
  ) => Promise<{ productId: string } | undefined>;
  categories: CategoryWithSubcategories[];
}

/**
 * Client-side wrapper for adding new products
 *
 * This component manages the entire product creation flow on the client:
 * - Form state and validation tracking
 * - Success modal with auto-redirect to edit page
 * - Error handling and display
 * - Form reset functionality
 * - Context provision for nested form components
 *
 * @component
 * @example
 * // In app/add-product/page.tsx (server component)
 * import { addProduct } from '@/lib/actions/products';
 * import AddProductClient from '@/components/clients/add-product-client';
 *
 * export default async function AddProductPage() {
 *   const categories = await prisma.category.findMany();
 *   return <AddProductClient formAction={addProduct} categories={categories} />;
 * }
 *
 * @param {Function} formAction - Server action to handle product creation
 * @param {CategoryWithSubcategories[]} categories - Available categories for the product
 */
export default function AddProductClient({
  formAction,
  categories,
}: AddProductClientProps) {
  const router = useRouter();
  const { message, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: UI_TIMING.ERROR_MESSAGE_TIMEOUT_MS,
  });
  const { errors: formErrors, clearErrors: clearFormErrors } = useFormErrors();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    clearMessage();
    clearFormErrors();
    setIsSubmitting(true);

    try {
      const result = await formAction(formData);

      // Extract product ID from result
      if (result && typeof result === "object" && "productId" in result) {
        setCreatedProductId(result.productId);
      }

      triggerSuccessFlow();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      showError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const redirectToEditPage = useCallback(() => {
    if (createdProductId) {
      router.push(getEditProductPath(createdProductId));
      router.refresh();
    }
  }, [createdProductId, router]);

  const triggerSuccessFlow = () => {
    clearMessage();
    setIsSubmitting(false);
    setIsSuccessModalOpen(true);
    successTimeoutRef.current = setTimeout(() => {
      setIsSuccessModalOpen(false);
      redirectToEditPage();
    }, UI_TIMING.SUCCESS_MODAL_DELAY_MS);
  };

  const handleSuccessModalClose = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
    setIsSuccessModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
    };
  }, []);

  const handleReset = useCallback(() => {
    formRef.current?.reset();
    clearFormErrors();
  }, [clearFormErrors]);

  return (
    <>
      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Product Created"
        subtitle="Your new product has been successfully added to inventory."
        onClose={handleSuccessModalClose}
      />

      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
        <MessageBanner message={message} />

        <StickyFormHeader
          title="Add Product"
          subtitle="Add a new product to your inventory"
          backHref="/inventory"
          backLabel="← Back to Inventory"
          isLoading={isSubmitting}
          submitLabel="Create Product"
          alwaysShowReset
          onReset={handleReset}
        />

        <ProductFormContext.Provider
          value={{ formErrors, isSubmitting, onSubmit: handleFormSubmit }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column: Form Sections */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <AddProductForm categories={categories} />
            </div>

            {/* Right Column: Image, Categories */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <ProductFormSidebar categories={categories} />
            </div>
          </div>
        </ProductFormContext.Provider>
      </div>
    </>
  );
}
