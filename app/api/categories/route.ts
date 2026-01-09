import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { apiValidateCategoryInput } from "@/lib/validators/categories";

export const GET = withApiHandler(async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "desc" },
  });
  return NextResponse.json(categories);
});

export const POST = withApiHandler(
  async (req: Request) => {
    const body = await req.json();
    const validated = apiValidateCategoryInput(body);

    if (validated instanceof NextResponse) {
      return validated;
    }

    const category = await prisma.category.create({
      data: { name: validated.name },
    });

    return NextResponse.json(category, { status: 201 });
  },
  {
    rateLimit: {
      prefix: "api:categories:create:",
      limit: 20,
      windowMs: 60_000,
    },
  }
);
