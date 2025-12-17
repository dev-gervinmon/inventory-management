"use client";

import { useState, FormEvent } from "react";
import FormButton from "./buttons/form-button";
import { confirmDelete, formatCategoryDate } from "@/lib/utils/categories";

interface Subcategory {
  id: string;
  name: string;
  createdAt: Date;
}

export default function SubcategoryForm({
  subcategory,
  categoryId,
  categoryName,
  formAction,
  deleteAction,
}: {
  subcategory: Subcategory;
  categoryId: string;
  categoryName: string;
  formAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(subcategory.name);

  const handleDelete = (e: FormEvent<HTMLFormElement>) => {
    if (!confirmDelete(subcategory.name, "subcategory")) {
      e.preventDefault();
    }
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await formAction(formData);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-linear-to-r from-blue-50 to-transparent">
      {isEditing ? (
        <form onSubmit={handleSave} className="flex-1 flex gap-3 items-center">
          <input type="hidden" name="id" value={subcategory.id} />
          <input type="hidden" name="categoryId" value={categoryId} />
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Subcategory name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
          <FormButton
            type="button"
            label="Cancel"
            variant="secondary"
            size="sm"
            onClick={() => {
              setIsEditing(false);
              setName(subcategory.name);
            }}
          />
        </form>
      ) : (
        <>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {subcategory.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatCategoryDate(subcategory.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
            >
              Edit
            </button>
            <form
              onSubmit={handleDelete}
              action={deleteAction}
              className="inline"
            >
              <input type="hidden" name="id" value={subcategory.id} />
              <input type="hidden" name="categoryId" value={categoryId} />
              <button
                type="submit"
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
