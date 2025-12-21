"use client";

import FormButton from "@/components/buttons/form-button";

export default function DeleteCategoryButton({
  onDelete,
}: {
  categoryId: string;
  categoryName: string;
  onDelete: () => void;
}) {
  return (
    <FormButton
      type="button"
      onClick={onDelete}
      label="Delete Category"
      variant="delete"
      size="md"
      className="w-full"
    />
  );
}
