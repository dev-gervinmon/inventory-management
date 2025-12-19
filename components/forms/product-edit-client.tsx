"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import StickyFormHeader from "@/components/layout/sticky-form-header";
import ProductInfoSidebar from "@/components/layout/product-info-sidebar";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import { useMessage } from "@/lib/hooks/useMessage";
import MessageBanner from "@/components/common/message-banner";

interface Category {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}

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
  children: React.ReactNode;
}

export default function ProductEditClient({
  product,
  formAction,
  deleteAction,
  children,
}: ProductEditClientProps) {
  const router = useRouter();
  const { message, showSuccess, showError, clearMessage } = useMessage({
    autoClose: true,
    timeout: 5000,
  });

  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  // Track form changes
  useEffect(() => {
    const form = document.querySelector("form");
    if (!form) return;
    formRef.current = form;

    const handleFormChange = () => {
      setIsDirty(true);
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
      setTimeout(() => {
        router.push("/inventory");
        router.refresh();
      }, 1500);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setIsDeleting(false);
      setIsDeletingOpen(false);
    }
  };

  const handleNavigationBlock = (href: string) => {
    if (!isDirty) {
      router.push(href);
      return;
    }
    setPendingNavigation(href);
    setIsNavigationBlocked(true);
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
    }
  };

  return (
    <div className="p-8 space-y-6">
      <MessageBanner message={message} />

      <StickyFormHeader
        title="Edit Product"
        subtitle={`${product.name} • Product ID: ${product.id}`}
        backHref="/inventory"
        isDirty={isDirty}
        onReset={handleReset}
        onBack={handleNavigationBlock}
      />

      {/* Add padding for sticky header */}
      <div className="pt-20" />

      <div className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              {children}
            </div>
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
