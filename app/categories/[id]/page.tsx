import EditCategoryWrapper from "@/components/wrappers/edit-category-wrapper";
import EditCategoryPageWrapper from "./edit-category-page-wrapper";
import NotFoundPage from "@/components/layout/not-found-page";
import { editSubcategory } from "@/lib/actions/subcategories";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getCurrentUser();
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      subcategories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    return (
      <NotFoundPage
        entityId={id}
        entityName="Category"
        storageKey="deletedCategoryId"
        redirectPath="/categories"
        backButtonLabel="Back to Categories"
        sidebarPath="/categories"
      />
    );
  }

  return (
    <EditCategoryPageWrapper>
      <EditCategoryWrapper
        category={category}
        editSubcategory={editSubcategory}
      />
    </EditCategoryPageWrapper>
  );
}
