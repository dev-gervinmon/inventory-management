import { getCurrentUser } from "@/lib/auth/auth";
import prisma from "@/lib/db/prisma";
import InventoryPageWrapper from "./inventory-page-wrapper";
import { serializeProduct } from "@/app/src/utils/product";
import { getAllCategories } from "@/lib/actions/categories";
import InventoryPageClient from "../../../components/page-specific/inventory/client/inventory-page-client";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  const userId = user.id;
  const { status } = await searchParams;

  // Fetch all products for the user (client-side filtering/sorting/pagination)
  const itemsRaw = await prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      categories: true,
      subcategories: {
        include: {
          category: true,
        },
      },
    },
  });

  const items = itemsRaw.map(serializeProduct);

  const categories = await getAllCategories();

  return (
    <InventoryPageWrapper>
      <InventoryPageClient
        products={items}
        categories={categories}
        initialStatusFilter={status}
      />
    </InventoryPageWrapper>
  );
}
