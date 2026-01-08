import CategoriesPageWrapper from "./_components/categories-page-wrapper";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import CategoriesPageContent from "./_components/categories-content";

export default async function CategoriesPage() {
  await getCurrentUser();

  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <CategoriesPageWrapper>
      <>
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-(--text-primary)">
              Categories
            </h1>
            <p className="text-xs sm:text-sm text-(--text-secondary) mt-0.5 sm:mt-1">
              Manage product categories
            </p>
          </div>
        </div>

        {/* Main Form and Categories in 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8">
          {/* Right Column: Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-glass rounded-2xl border border-(--border-subtle) p-3 sm:p-4 md:p-6 hover:border-(--border-strong) transition-colors">
              <CategoriesPageContent initialCategories={categories} />
            </div>
          </div>
        </div>
      </>
    </CategoriesPageWrapper>
  );
}
