"use client";

import { deleteSubcategory } from "@/lib/actions/subcategories";
import { FormEvent } from "react";

export default function DeleteSubcategoryButton({
  subcategoryId,
  categoryId,
}: {
  subcategoryId: string;
  categoryId: string;
}) {
  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteSubcategory} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={subcategoryId} />
      <input type="hidden" name="categoryId" value={categoryId} />
      <button
        type="submit"
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
      >
        Delete Subcategory
      </button>
    </form>
  );
}
