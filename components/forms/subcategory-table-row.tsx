"use client";

import { useState } from "react";
import { formatCategoryDate } from "@/lib/utils/categories";
import EditSubcategoryModal from "./edit-subcategory-modal";

interface Subcategory {
  id: string;
  name: string;
  createdAt: Date;
}

export default function SubcategoryTableRow({
  subcategory,
  categoryId,
  formAction,
}: {
  subcategory: Subcategory;
  categoryId: string;
  formAction: (
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-900">
          {subcategory.name}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatCategoryDate(subcategory.createdAt)}
      </td>

      <EditSubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subcategory={subcategory}
        categoryId={categoryId}
        formAction={formAction}
      />

      {/* Hidden button to trigger modal from parent row */}
      <button
        type="button"
        className="hidden"
        data-edit-trigger
        onClick={() => setIsModalOpen(true)}
      />
    </>
  );
}
