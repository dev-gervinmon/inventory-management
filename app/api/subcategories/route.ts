import prisma from "@/lib/db/prisma";
import {
  apiExistingCategoryCheck,
  apiValidateSubcategoryInput,
} from "@/lib/validators/subcategories";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";

export const GET = withApiHandler(async () => {
  const subcategories = await prisma.subcategory.findMany({
    orderBy: { name: "desc" },
  });
  return NextResponse.json(subcategories);
});

export const POST = withApiHandler(async (req: Request) => {
  const body = await req.json();
  const validated = apiValidateSubcategoryInput(body);

  if (validated instanceof NextResponse) {
    return validated;
  }

  await apiExistingCategoryCheck(validated.categoryId);

  const subcategory = await prisma.subcategory.create({
    data: { name: validated.name, categoryId: validated.categoryId },
  });
  return NextResponse.json(subcategory, { status: 201 });
});
