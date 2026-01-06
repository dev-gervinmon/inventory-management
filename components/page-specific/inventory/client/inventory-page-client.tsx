"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductButton from "@/components/buttons/add-product-button";
import { Card } from "@/components/common/card";
import ProductTableContent from "../../../../app/(app)/inventory/product-table-content";
import type { SerializedProduct } from "@/app/src/utils/product";
import type { CategoryWithSubcategories } from "@/lib/types/category";
import ProductDrawer from "../common/product-drawer";

type DrawerState =
  | { isOpen: false }
  | { isOpen: true; mode: "create" }
  | { isOpen: true; mode: "edit"; productId: string };

interface InventoryPageClientProps {
  products: SerializedProduct[];
  categories: CategoryWithSubcategories[];
  initialStatusFilter?: string;
}

export default function InventoryPageClient({
  products,
  categories,
  initialStatusFilter,
}: InventoryPageClientProps) {
  const router = useRouter();

  const [drawer, setDrawer] = useState<DrawerState>({ isOpen: false });

  const activeProduct = useMemo(() => {
    if (!drawer.isOpen || drawer.mode !== "edit") return null;
    return products.find((p) => p.id === drawer.productId) ?? null;
  }, [drawer, products]);

  const openCreate = () => setDrawer({ isOpen: true, mode: "create" });
  const openEdit = (productId: string) =>
    setDrawer({ isOpen: true, mode: "edit", productId });
  const closeDrawer = () => setDrawer({ isOpen: false });

  const handleSaved = () => {
    // Ensure inventory list reflects the latest changes
    router.refresh();
    closeDrawer();
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-(--text-primary)">
              Inventory
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-(--text-muted) mt-0.5 sm:mt-1">
              Manage your products and track inventory levels
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <AddProductButton
              onClick={openCreate}
              className="cursor-pointer w-full sm:w-auto justify-center sm:justify-start"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Product Table Card */}
        <Card className="border-(--border-strong) bg-glass p-3 sm:p-4 md:p-6 min-w-0">
          <ProductTableContent
            products={products}
            initialStatusFilter={initialStatusFilter}
            onEditProduct={openEdit}
          />
        </Card>
      </div>

      <ProductDrawer
        isOpen={drawer.isOpen}
        mode={drawer.isOpen ? drawer.mode : "create"}
        product={activeProduct}
        categories={categories}
        onClose={closeDrawer}
        onSaved={handleSaved}
      />
    </>
  );
}
