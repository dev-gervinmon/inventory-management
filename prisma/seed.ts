import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const demoUserId = "292489e6-837a-4520-957b-97f153a5bd53";

  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: { name: "Electronics" },
    include: { subcategories: true },
  });

  if (existingCategory) {
    console.log("✓ Electronics category already exists, skipping seed");
    console.log(
      `  Contains ${existingCategory.subcategories.length} subcategories`
    );
    return;
  }

  // Create a category with subcategories
  const category = await prisma.category.create({
    data: {
      name: "Electronics",
      subcategories: {
        create: [
          { name: "Laptops" },
          { name: "Desktops" },
          { name: "Tablets" },
          { name: "Smartphones" },
          { name: "Accessories" },
          { name: "Monitors" },
          { name: "Keyboards & Mice" },
          { name: "Audio Equipment" },
          { name: "Cameras" },
          { name: "Smart Home Devices" },
        ],
      },
    },
    include: {
      subcategories: true,
    },
  });

  console.log("✓ Seed data created successfully!");
  console.log(`✓ Created category: ${category.name}`);
  console.log(`✓ Created ${category.subcategories.length} subcategories`);
  console.log("\nSubcategories:");
  category.subcategories.forEach((sub) => {
    console.log(`  - ${sub.name}`);
  });

  // Create products
  await prisma.product.createMany({
    data: Array.from({ length: 25 }, (_, i) => ({
      userId: demoUserId,
      name: `Product ${i + 1}`,
      price: Math.floor(Math.random() * 90 + 10).toFixed(2),
      quantity: Math.floor(Math.random() * 20),
      lowStockAt: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 5)),
    })),
  });

  console.log(`✓ Created 25 products for user ID: ${demoUserId}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
