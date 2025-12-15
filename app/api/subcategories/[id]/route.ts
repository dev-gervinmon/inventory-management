import { withApiHandler } from "@/lib/api/handler";
import prisma from "@/lib/prisma";
import { parseSubcategoryDataJSON } from "@/lib/schemas/subcategories";
import {
  apiRequireCategoryExists,
  apiRequireSubcategoryExists,
} from "@/lib/validators/categories";
import { apiRequireId } from "@/lib/validators/subcategories";
import { NextResponse } from "next/server";

export const PUT = withApiHandler(
  async (req: Request, context?: { params: { id: string } }) => {
    const params = await context!.params;

    const id = apiRequireId(params);

    const body = await req.json();
    const parsed = parseSubcategoryDataJSON(body);

    await apiRequireCategoryExists(parsed.categoryId);

    const subcategory = await prisma.subcategory.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(subcategory);
  }
);

export const DELETE = withApiHandler(
  async (req: Request, context?: { params: { id: string } }) => {
    const params = await context!.params;
    const id = apiRequireId(params);

    await apiRequireSubcategoryExists(id);

    await prisma.subcategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }
);
