import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { parseCategoryDataJSON } from "@/lib/schemas/categories";
import {
  apiRequireCategoryExists,
  apiRequireId,
} from "@/lib/validators/categories";

export const PUT = withApiHandler(
  async (req: Request, context?: { params: { id: string } }) => {
    const params = await context!.params;
    const id = apiRequireId(params);

    const body = await req.json();
    const parsed = parseCategoryDataJSON(body);

    await apiRequireCategoryExists(id);

    const category = await prisma.category.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(category);
  }
);

export const DELETE = withApiHandler(
  async (req: Request, context?: { params: { id: string } }) => {
    const params = await context!.params;
    const id = apiRequireId(params);

    await apiRequireCategoryExists(id);

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }
);
