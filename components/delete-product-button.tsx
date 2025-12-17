"use client";

import { deleteProduct } from "@/lib/actions/products";
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
      <button
        formAction={handleDeleteAction}
        className="text-red-600 hover:text-red-900 font-medium"
      >
        Delete
      </button>
    </form>
  );
}
