"use client";

import { deleteCategory } from "@/lib/actions/categories";
import { FormEvent } from "react";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? All subcategories will also be deleted."
      )
    ) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteCategory} className="w-full" onSubmit={handleDelete}>
      <input type="hidden" name="id" value={categoryId} />
      <button
        type="submit"
        className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-100 cursor-pointer"
      >
        Delete Category
      </button>
    </form>
  );
}
