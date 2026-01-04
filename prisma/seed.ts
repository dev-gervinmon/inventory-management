import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const userId = process.env.SEED_USER_ID;
  const reset =
    process.env.SEED_RESET === "1" || process.env.SEED_RESET === "true";

  if (!userId) {
    console.log("\n✖ Missing SEED_USER_ID");
    console.log(
      "Run the app, sign in, then open /api/debug/whoami to copy your user id."
    );
    console.log(
      'Then run: $env:SEED_USER_ID="<your-user-id>"; $env:SEED_RESET="1"; npx prisma db seed\n'
    );
    process.exit(1);
  }

  const userKey = userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "demo";

  if (reset) {
    console.log("\n• Resetting existing demo data for user...");
    await prisma.stockMovement.deleteMany({ where: { product: { userId } } });
    await prisma.activity.deleteMany({ where: { userId } });
    await prisma.inventoryValueSnapshot.deleteMany({ where: { userId } });
    await prisma.inventoryHealthSnapshot.deleteMany({ where: { userId } });
    await prisma.product.deleteMany({ where: { userId } });
    console.log("✓ Cleared user-scoped data");
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
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: { name: categoryData.name },
    });

    await prisma.subcategory.createMany({
      data: categoryData.subcategories.map((name) => ({
        name,
        categoryId: category.id,
      })),
      skipDuplicates: true,
    });

    console.log(`✓ Ensured category: ${categoryData.name}`);
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
          userId,
          name: productData.name,
          sku: productData.sku
            ? `${userKey}-${productData.sku}`
            : `${userKey}-${productData.name
                .toUpperCase()
                .replace(/\s+/g, "-")}`,
          price: productData.price.toString(),
          unitCost: (
            Number(productData.price) *
            (0.6 + Math.random() * 0.2)
          ).toFixed(2),
          quantity: productData.quantity,
          lowStockAt: 5 + Math.floor(Math.random() * 16),
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

  // Ensure a few edge-case products (missing cost / low / out)
  const existingCount = await prisma.product.count({ where: { userId } });
  if (existingCount > 0) {
    await prisma.product.createMany({
      data: [
        {
          userId,
          name: "(Demo) Sachet Shampoo - Small",
          sku: `${userKey}-SACHET-SHAMPOO-SMALL`,
          price: "8.00",
          unitCost: null,
          quantity: 0,
          lowStockAt: 10,
        },
        {
          userId,
          name: "(Demo) Sardines Can",
          sku: `${userKey}-SARDINES-CAN`,
          price: "28.00",
          unitCost: "18.00",
          quantity: 6,
          lowStockAt: 12,
        },
      ],
      skipDuplicates: true,
    });
  }

  // Seed some stock movements and activities if none exist for this user
  const movementCount = await prisma.stockMovement.count({
    where: { product: { userId } },
  });

  if (movementCount === 0) {
    console.log("\n• Seeding stock movements (last 30 days)...");

    const products = await prisma.product.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    const now = new Date();
    const movements: {
      productId: string;
      quantity: number;
      direction: "IN" | "OUT";
      reason: string;
      source: string;
      createdAt: Date;
    }[] = [];

    for (const product of products.slice(0, 18)) {
      const count = 3 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now);
        createdAt.setDate(createdAt.getDate() - daysAgo);
        createdAt.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0);

        const direction = Math.random() < 0.55 ? "OUT" : "IN";
        const quantity = 1 + Math.floor(Math.random() * 8);
        const reason =
          direction === "OUT"
            ? Math.random() < 0.7
              ? "SALE"
              : "ADJUSTMENT"
            : Math.random() < 0.7
            ? "REFILL"
            : "DELIVERY";

        movements.push({
          productId: product.id,
          quantity,
          direction,
          reason,
          source: "SYSTEM",
          createdAt,
        });
      }
    }

    await prisma.stockMovement.createMany({ data: movements });
    console.log(`✓ Created ${movements.length} stock movements`);

    const activityCount = await prisma.activity.count({ where: { userId } });
    if (activityCount === 0) {
      const sample = products.slice(0, 8);
      await prisma.activity.createMany({
        data: sample.map((p, idx) => ({
          userId,
          entityType: "PRODUCT",
          actionType: idx === 0 ? "ADDED" : "STOCK_UPDATED",
          entityId: p.id,
          entityName: p.name,
          message:
            idx === 0
              ? `Added product ${p.name}`
              : `Updated stock for ${p.name}`,
          details: undefined,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12 * idx),
        })),
      });
      console.log(`✓ Created ${sample.length} activity records`);
    }
  }

  // Backfill snapshots so trend charts render immediately
  const snapshotDays = 30;
  console.log(`\n• Backfilling ${snapshotDays} days of snapshots...`);

  const productsForValue = await prisma.product.findMany({
    where: { userId },
    select: {
      quantity: true,
      price: true,
      unitCost: true,
      lowStockAt: true,
    },
  });

  const baseRetail = productsForValue.reduce(
    (sum, p) => sum + Number(p.quantity) * Number(p.price),
    0
  );
  const baseCost = productsForValue.reduce((sum, p) => {
    if (p.unitCost === null) return sum;
    return sum + Number(p.quantity) * Number(p.unitCost);
  }, 0);
  const baseProfit = productsForValue.reduce((sum, p) => {
    if (p.unitCost === null) return sum;
    const retail = Number(p.quantity) * Number(p.price);
    const cost = Number(p.quantity) * Number(p.unitCost);
    return sum + (retail - cost);
  }, 0);
  const baseMissingCost = productsForValue.reduce(
    (count, p) => (p.unitCost === null ? count + 1 : count),
    0
  );

  const baseTotalProducts = productsForValue.length;
  const baseOut = productsForValue.reduce(
    (count, p) => (Number(p.quantity) <= 0 ? count + 1 : count),
    0
  );
  const baseLow = productsForValue.reduce((count, p) => {
    const qty = Number(p.quantity);
    if (qty <= 0) return count;
    if (typeof p.lowStockAt === "number" && qty <= p.lowStockAt)
      return count + 1;
    return count;
  }, 0);
  const today = new Date();
  const dateOnly = (d: Date) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

  for (let i = snapshotDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const snapshotDate = dateOnly(d);

    // simple deterministic-ish progression + noise
    const t = (snapshotDays - 1 - i) / Math.max(1, snapshotDays - 1);
    const drift = 0.92 + t * 0.12;
    const noise = 0.985 + Math.random() * 0.03;
    const factor = drift * noise;

    await prisma.inventoryValueSnapshot.upsert({
      where: { userId_snapshotDate: { userId, snapshotDate } },
      update: {},
      create: {
        userId,
        snapshotDate,
        totalRetailValue: (baseRetail * factor).toFixed(2),
        totalCostValue: (baseCost * factor).toFixed(2),
        totalPotentialProfit: (baseProfit * factor).toFixed(2),
        productsMissingCost: baseMissingCost,
      },
    });

    // Health snapshots: slightly worse in the past
    const criticalBias = Math.round((1 - t) * 2);
    const out = Math.min(
      baseTotalProducts,
      baseOut + (Math.random() < 0.3 ? criticalBias : 0)
    );
    const low = Math.min(
      baseTotalProducts - out,
      baseLow + (Math.random() < 0.5 ? criticalBias : 0)
    );
    const inStock = Math.max(0, baseTotalProducts - out - low);

    await prisma.inventoryHealthSnapshot.upsert({
      where: { userId_snapshotDate: { userId, snapshotDate } },
      update: {},
      create: {
        userId,
        snapshotDate,
        totalProducts: baseTotalProducts,
        inStockCount: inStock,
        lowStockCount: low,
        outOfStockCount: out,
      },
    });
  }

  console.log("✓ Snapshots backfilled");

  console.log("\n✓ Seed complete!");
  console.log(`• Seeded for userId: ${userId}`);
  console.log("• Open /dashboard to verify cards + pages");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
