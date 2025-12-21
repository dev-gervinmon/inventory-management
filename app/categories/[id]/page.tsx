import EditCategoryWrapper from "@/components/layout/edit-category-wrapper";
import CategoryNotFound from "@/components/layout/category-not-found";
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
    return <CategoryNotFound categoryId={id} />;
  }

  return (
    <EditCategoryWrapper
      category={category}
      editSubcategory={editSubcategory}
    />
  );
}
