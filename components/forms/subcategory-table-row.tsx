"use client";

import { formatCategoryDate } from "@/lib/utils/categories";

interface Subcategory {
  id: string;
  name: string;
  createdAt: Date;
}

export default function SubcategoryTableRow({
  subcategory,
  categoryId,
  onEdit,
}: {
  subcategory: Subcategory;
  categoryId: string;
  onEdit: () => void;
}) {
  return (
    <>
      <td className="px-6 py-4">
        <span
          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600"
          onClick={onEdit}
        >
          {subcategory.name}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatCategoryDate(subcategory.createdAt)}
      </td>
    </>
  );
}
