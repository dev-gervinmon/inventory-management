"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "./add-product-form";
import ProductFormSidebar from "./product-form-sidebar";
import StickyFormHeader from "@/components/layout/sticky-form-header";
import { useMessage } from "@/lib/hooks/useMessage";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import SuccessModal from "@/components/modals/success-modal";
import { CategoryWithSubcategories } from "@/lib/types/category";
import { UI_TIMING, getEditProductPath } from "@/lib/constants/forms";

interface AddProductClientProps {
  formAction: (
    formData: FormData
  ) => Promise<{ productId: string } | undefined>;
  categories: CategoryWithSubcategories[];
}

export default function AddProductClient({
  formAction,
  categories,
}: AddProductClientProps) {
  const router = useRouter();
  const { showError } = useMessage({
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
    }
    setIsSuccessModalOpen(false);
    redirectToEditPage();
  };

  const handleReset = useCallback(() => {
    formRef.current?.reset();
    clearFormErrors();
  }, [clearFormErrors]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="ml-64 p-8">
        {/* Success Modal */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          title="Product Created"
          subtitle="Your new product has been successfully added to inventory."
          onClose={handleSuccessModalClose}
        />

        <StickyFormHeader
          title="Add Product"
          subtitle="Add a new product to your inventory"
          backHref="/inventory"
          isLoading={isSubmitting}
          submitLabel="Create Product"
          alwaysShowReset
          onReset={handleReset}
          onBack={(href) => router.push(href)}
        />

        {/* Add padding for sticky header */}
        <div className="pt-20" />

        <ProductFormContext.Provider
          value={{ formErrors, isSubmitting, onSubmit: handleFormSubmit }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form Sections */}
            <div className="space-y-8">
              <AddProductForm categories={categories} />
            </div>

            {/* Right Column: Image, Categories */}
            <div className="space-y-8">
              <ProductFormSidebar categories={categories} />
            </div>
          </div>
        </ProductFormContext.Provider>
      </main>
    </div>
  );
}
