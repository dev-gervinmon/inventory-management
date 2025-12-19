import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const demoUserId = "292489e6-837a-4520-957b-97f153a5bd53";

  // Check if categories already exist
  const existingCategories = await prisma.category.count();

  if (existingCategories > 0) {
    console.log(
      `✓ Categories already exist (${existingCategories} found), skipping seed`
    );
    return;
  }

  // Category data with subcategories
  const categoriesData = [
    {
      name: "Electronics",
      subcategories: [
        "Laptops",
        "Desktops",
        "Tablets",
        "Smartphones",
        "Accessories",
      ],
    },
    {
      name: "Clothing",
      subcategories: [
        "Men's Wear",
        "Women's Wear",
        "Kids Wear",
        "Footwear",
        "Accessories",
      ],
    },
    {
      name: "Home & Garden",
      subcategories: ["Furniture", "Bedding", "Kitchen", "Gardening", "Decor"],
    },
    {
      name: "Sports & Outdoors",
      subcategories: [
        "Fitness",
        "Team Sports",
        "Camping",
        "Water Sports",
        "Cycling",
      ],
    },
    {
      name: "Books & Media",
      subcategories: ["Books", "eBooks", "Audiobooks", "Magazines", "Movies"],
    },
    {
      name: "Beauty & Personal Care",
      subcategories: [
        "Skincare",
        "Haircare",
        "Makeup",
        "Fragrance",
        "Bath & Body",
      ],
    },
    {
      name: "Toys & Games",
      subcategories: [
        "Board Games",
        "Video Games",
        "Action Figures",
        "Puzzles",
        "Outdoor Toys",
      ],
    },
    {
      name: "Food & Beverage",
      subcategories: [
        "Snacks",
        "Beverages",
        "Frozen Foods",
        "Organic",
        "International",
      ],
    },
    {
      name: "Automotive",
      subcategories: ["Accessories", "Tools", "Cleaning", "Parts", "Safety"],
    },
    {
      name: "Pet Supplies",
      subcategories: [
        "Dog Food",
        "Cat Food",
        "Toys",
        "Bedding",
        "Health & Grooming",
      ],
    },
    {
      name: "Office Supplies",
      subcategories: [
        "Paper Products",
        "Writing Instruments",
        "Organizers",
        "Technology",
        "Furniture",
      ],
    },
    {
      name: "Musical Instruments",
      subcategories: [
        "Guitars",
        "Keyboards",
        "Drums",
        "Wind Instruments",
        "Accessories",
      ],
    },
    {
      name: "Health & Wellness",
      subcategories: [
        "Vitamins",
        "Supplements",
        "Medical Devices",
        "Fitness Equipment",
        "Wellness",
      ],
    },
    {
      name: "Jewelry & Watches",
      subcategories: ["Rings", "Necklaces", "Bracelets", "Watches", "Earrings"],
    },
    {
      name: "Tools & Hardware",
      subcategories: [
        "Power Tools",
        "Hand Tools",
        "Safety Equipment",
        "Hardware",
        "Storage",
      ],
    },
  ];

  // Create categories with subcategories
  for (const categoryData of categoriesData) {
    await prisma.category.create({
      data: {
        name: categoryData.name,
        subcategories: {
          create: categoryData.subcategories.map((name) => ({ name })),
        },
      },
      include: {
        subcategories: true,
      },
    });
    console.log(`✓ Created category: ${categoryData.name}`);
  }

  console.log(`\n✓ Seed data created successfully!`);
  console.log(
    `✓ Created ${categoriesData.length} categories with subcategories`
  );
  console.log(
    `✓ Total subcategories: ${categoriesData.reduce(
      (sum, c) => sum + c.subcategories.length,
      0
    )}`
  );

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
