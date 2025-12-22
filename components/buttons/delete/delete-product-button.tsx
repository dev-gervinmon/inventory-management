"use client";

import { deleteProduct } from "@/lib/actions/products";
import TouchOptimizedIconButton from "@/components/buttons/touch-optimized-icon-button";
import { Trash2 } from "lucide-react";
import { FormEvent } from "react";

export default function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      e.preventDefault();
    }
  };

  const handleDeleteAction = async (formData: FormData) => {
    await deleteProduct(productId);
  };

  return (
    <form onSubmit={handleDelete} className="inline">
      <input type="hidden" name="id" value={productId} />
      <TouchOptimizedIconButton
        icon={<Trash2 className="w-4 h-4" />}
        label="Delete product"
        variant="delete"
        size="md"
      />
    </form>
  );
}
