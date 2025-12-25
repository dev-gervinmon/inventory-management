import PageLayout from "@/components/layout/page-layout";
import PullToRefreshWrapper from "@/components/layout/pull-to-refresh-wrapper";
import CategoriesPageWrapper from "./categories-page-wrapper";
import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import CategoriesPageContent from "./categories-content";
import CategoryFormWrapper from "./category-form-wrapper";

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
      <PageLayout currentPath="/categories">
        <PullToRefreshWrapper>
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Categories
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 mt-0.5 sm:mt-1">
                Manage product categories
              </p>
            </div>
          </div>

          {/* Main Form and Categories in 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-8">
            {/* Left Column: Add Category Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 sticky top-20 sm:top-24 md:top-8 z-10">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
                  Add New Category
                </h2>
                <CategoryFormWrapper />
              </div>
            </div>

            {/* Right Column: Categories List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <CategoriesPageContent initialCategories={categories} />
              </div>
            </div>
          </div>
        </PullToRefreshWrapper>
      </PageLayout>
    </CategoriesPageWrapper>
  );
}
