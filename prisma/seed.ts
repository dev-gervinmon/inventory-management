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
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });

  // Product templates with realistic data
  const productTemplates = [
    // Electronics
    {
      categoryName: "Electronics",
      products: [
        {
          name: "MacBook Pro 16inch",
          sku: "MBP16-M3-2024",
          price: 2499.99,
          quantity: 8,
        },
        {
          name: "Dell XPS 15 Laptop",
          sku: "DELXPS15-I7",
          price: 1899.99,
          quantity: 12,
        },
        {
          name: "iPad Pro 12.9inch",
          sku: "IPADPRO129-2024",
          price: 1299.99,
          quantity: 15,
        },
        {
          name: "iPhone 15 Pro",
          sku: "IP15PRO-256GB",
          price: 999.99,
          quantity: 5,
        },
        {
          name: "USB-C Hub Adapter",
          sku: "USBC-HUB-7IN1",
          price: 49.99,
          quantity: 45,
        },
        {
          name: "Wireless Charging Pad",
          sku: "WCHARGE-15W",
          price: 29.99,
          quantity: 32,
        },
        {
          name: "4K Monitor LG 27inch",
          sku: "LG27UP550-4K",
          price: 599.99,
          quantity: 6,
        },
        {
          name: "Mechanical Keyboard RGB",
          sku: "MECH-KB-RGB",
          price: 149.99,
          quantity: 18,
        },
      ],
      subcategories: ["Laptops", "Tablets", "Smartphones", "Accessories"],
    },
    // Clothing
    {
      categoryName: "Clothing",
      products: [
        {
          name: "Premium Cotton T-Shirt",
          sku: "TSHIRT-COTTON-BLK",
          price: 29.99,
          quantity: 85,
        },
        {
          name: "Denim Jeans Classic Fit",
          sku: "JEANS-CLASSIC-32",
          price: 79.99,
          quantity: 42,
        },
        {
          name: "Wool Winter Coat",
          sku: "COAT-WOOL-L",
          price: 299.99,
          quantity: 12,
        },
        {
          name: "Running Shoes Pro",
          sku: "SHOES-RUN-10",
          price: 119.99,
          quantity: 28,
        },
        {
          name: "Silk Scarf",
          sku: "SCARF-SILK-RED",
          price: 39.99,
          quantity: 22,
        },
      ],
      subcategories: ["Men's Wear", "Women's Wear", "Footwear", "Accessories"],
    },
    // Home & Garden
    {
      categoryName: "Home & Garden",
      products: [
        {
          name: "Ergonomic Office Chair",
          sku: "CHAIR-ERG-BLACK",
          price: 349.99,
          quantity: 11,
        },
        {
          name: "Queen Bed Frame",
          sku: "BED-QUEEN-OAK",
          price: 599.99,
          quantity: 4,
        },
        {
          name: "Stainless Steel Cookware Set",
          sku: "COOKWARE-12PC",
          price: 189.99,
          quantity: 9,
        },
        {
          name: "Garden Tool Set",
          sku: "GARDEN-TOOLS-10PC",
          price: 69.99,
          quantity: 24,
        },
        {
          name: "Decorative Wall Art",
          sku: "ART-CANVAS-36X48",
          price: 99.99,
          quantity: 18,
        },
      ],
      subcategories: ["Furniture", "Bedding", "Kitchen", "Gardening", "Decor"],
    },
    // Sports & Outdoors
    {
      categoryName: "Sports & Outdoors",
      products: [
        {
          name: "Yoga Mat Premium",
          sku: "YOGA-MAT-6MM",
          price: 49.99,
          quantity: 38,
        },
        {
          name: "Basketball Professional",
          sku: "BALL-BASKET-PRO",
          price: 59.99,
          quantity: 16,
        },
        {
          name: "Camping Tent 4 Person",
          sku: "TENT-4P-DOME",
          price: 199.99,
          quantity: 7,
        },
        {
          name: "Mountain Bike 29inch",
          sku: "BIKE-MTN-29-XL",
          price: 899.99,
          quantity: 5,
        },
        {
          name: "Resistance Band Set",
          sku: "RESIST-BANDS-5PC",
          price: 24.99,
          quantity: 56,
        },
      ],
      subcategories: ["Fitness", "Team Sports", "Camping", "Cycling"],
    },
    // Books & Media
    {
      categoryName: "Books & Media",
      products: [
        {
          name: "Clean Code by Robert Martin",
          sku: "BOOK-CLEAN-CODE",
          price: 49.99,
          quantity: 15,
        },
        {
          name: "The Pragmatic Programmer",
          sku: "BOOK-PRAGMATIC",
          price: 52.99,
          quantity: 12,
        },
        {
          name: "Atomic Habits eBook",
          sku: "EBOOK-ATOMIC-HABITS",
          price: 9.99,
          quantity: 999,
        },
        {
          name: "Audiobook: Sapiens",
          sku: "AUDIO-SAPIENS",
          price: 14.99,
          quantity: 999,
        },
      ],
      subcategories: ["Books", "eBooks", "Audiobooks"],
    },
    // Beauty & Personal Care
    {
      categoryName: "Beauty & Personal Care",
      products: [
        {
          name: "Retinol Anti-Aging Serum",
          sku: "SERUM-RETINOL-30ML",
          price: 79.99,
          quantity: 22,
        },
        {
          name: "Shampoo Professional Grade",
          sku: "SHAMPOO-PRO-500ML",
          price: 34.99,
          quantity: 31,
        },
        {
          name: "Makeup Foundation SPF 30",
          sku: "FOUND-SPF30-120ML",
          price: 44.99,
          quantity: 28,
        },
        {
          name: "Luxury Perfume 100ml",
          sku: "PERF-LUXURY-100ML",
          price: 129.99,
          quantity: 8,
        },
      ],
      subcategories: ["Skincare", "Haircare", "Makeup", "Fragrance"],
    },
    // Toys & Games
    {
      categoryName: "Toys & Games",
      products: [
        {
          name: "Chess Master Set",
          sku: "CHESS-MASTER-WOOD",
          price: 89.99,
          quantity: 14,
        },
        {
          name: "Playstation 5 Console",
          sku: "PS5-CONSOLE-2024",
          price: 499.99,
          quantity: 3,
        },
        {
          name: "Action Figure Hero Collection",
          sku: "FIGURE-HERO-6PC",
          price: 59.99,
          quantity: 21,
        },
        {
          name: "1000 Piece Puzzle",
          sku: "PUZZLE-1000-NATURE",
          price: 24.99,
          quantity: 35,
        },
      ],
      subcategories: [
        "Board Games",
        "Video Games",
        "Action Figures",
        "Puzzles",
      ],
    },
    // Food & Beverage
    {
      categoryName: "Food & Beverage",
      products: [
        {
          name: "Premium Coffee Beans 1kg",
          sku: "COFFEE-PREMIUM-1KG",
          price: 34.99,
          quantity: 28,
        },
        {
          name: "Organic Green Tea Box",
          sku: "TEA-ORGANIC-50BAG",
          price: 19.99,
          quantity: 42,
        },
        {
          name: "Dark Chocolate Bar 70%",
          sku: "CHOCO-DARK-70-100G",
          price: 12.99,
          quantity: 76,
        },
        {
          name: "Protein Bar Mixed Pack",
          sku: "PROTEIN-BAR-12PC",
          price: 29.99,
          quantity: 44,
        },
      ],
      subcategories: ["Snacks", "Beverages", "Organic"],
    },
    // Health & Wellness
    {
      categoryName: "Health & Wellness",
      products: [
        {
          name: "Vitamin C Supplement",
          sku: "VIT-C-1000MG-60CAP",
          price: 14.99,
          quantity: 68,
        },
        {
          name: "Fish Oil Omega-3",
          sku: "OMEGA3-1000MG-90",
          price: 19.99,
          quantity: 54,
        },
        {
          name: "Digital Blood Pressure Monitor",
          sku: "BP-MONITOR-DIGITAL",
          price: 59.99,
          quantity: 11,
        },
        {
          name: "Yoga Mat with Strap",
          sku: "YOGA-MAT-ECO-6MM",
          price: 44.99,
          quantity: 32,
        },
      ],
      subcategories: [
        "Vitamins",
        "Supplements",
        "Medical Devices",
        "Fitness Equipment",
      ],
    },
  ];

  let totalProductsCreated = 0;

  for (const template of productTemplates) {
    const category = categories.find((c) => c.name === template.categoryName);
    if (!category) continue;

    // Get available subcategories for this category
    const availableSubcategoryIds = category.subcategories
      .filter((sub) => template.subcategories.includes(sub.name))
      .map((sub) => sub.id);

    for (let i = 0; i < template.products.length; i++) {
      const productData = template.products[i];

      // Randomly select 1-2 subcategories
      const selectedSubcategoryIds = availableSubcategoryIds
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.max(1, Math.floor(Math.random() * 2 + 1)));

      const product = await prisma.product.create({
        data: {
          userId: demoUserId,
          name: productData.name,
          sku: productData.sku,
          price: productData.price.toString(),
          quantity: productData.quantity,
          lowStockAt: 10,
          categories: {
            connect: [{ id: category.id }],
          },
          subcategories: {
            connect: selectedSubcategoryIds.map((id) => ({ id })),
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i * 3)),
        },
      });

      totalProductsCreated++;
      console.log(`  ✓ Created product: ${product.name}`);
    }
  }

  console.log(
    `\n✓ Created ${totalProductsCreated} products with categories and subcategories`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
