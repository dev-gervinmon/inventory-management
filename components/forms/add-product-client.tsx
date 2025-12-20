"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "./add-product-form";
import ProductFormSidebar from "./product-form-sidebar";
import StickyFormHeader from "@/components/layout/sticky-form-header";
import { useMessage } from "@/lib/hooks/useMessage";
import { useFormErrors } from "@/lib/hooks/useFormErrors";
import MessageBanner from "@/components/common/message-banner";
import { ProductFormContext } from "@/lib/contexts/product-form-context";
import SuccessModal from "@/components/modals/success-modal";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

interface AddProductClientProps {
  formAction: (formData: FormData) => void | Promise<void>;
  categories: Category[];
}

export default function AddProductClient({
  formAction,
  categories,
}: AddProductClientProps) {
  const router = useRouter();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 5000,
  });
  const { errors: formErrors, clearErrors: clearFormErrors } = useFormErrors();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    clearFormErrors();
    setIsSubmitting(true);

    try {
      await formAction(formData);
      // redirect() throws, so we shouldn't reach here - but kept as fallback
      triggerSuccessFlow();
    } catch (error) {
      // Next.js redirect throws with name 'NEXT_REDIRECT' - this means success!
      if (
        error instanceof Error &&
        (error.message === "NEXT_REDIRECT" || error.name === "RedirectError")
      ) {
        triggerSuccessFlow();
        return;
      }

      // Handle actual errors
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
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
      // Redirect to inventory after modal closes
      router.push("/inventory");
      router.refresh();
    }, 2500);
  };

  const handleSuccessModalClose = () => {
    // Clear the timeout if user closes manually
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setIsSuccessModalOpen(false);
    // Redirect immediately if user closes manually
    router.push("/inventory");
    router.refresh();
  };

  const handleReset = () => {
    const form = document.querySelector("form");
    if (form) {
      form.reset();
      clearFormErrors();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="ml-64 p-8">
        <MessageBanner message={message} />

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

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form Sections */}
            <div className="space-y-8">
              <ProductFormContext.Provider
                value={{ formErrors, isSubmitting, onSubmit: handleFormSubmit }}
              >
                <AddProductForm
                  formAction={formAction}
                  categories={categories}
                />
              </ProductFormContext.Provider>
            </div>

            {/* Right Column: Image, Categories */}
            <div className="space-y-8">
              <ProductFormContext.Provider
                value={{ formErrors, isSubmitting, onSubmit: handleFormSubmit }}
              >
                <ProductFormSidebar categories={categories} />
              </ProductFormContext.Provider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
