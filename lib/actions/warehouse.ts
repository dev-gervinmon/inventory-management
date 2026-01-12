"use server";

import { getCurrentUser } from "../auth/auth";
import prisma from "../db/prisma";
import { parseWarehouseData } from "../schemas/warehouse";
import { logActivity } from "./activities";
import { checkActionRateLimit } from "./rate-limit";

export async function getWarehouses() {
  const user = await getCurrentUser();

  const warehouses = await prisma.warehouse.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return warehouses;
}

export async function getDefaultWarehouse() {
  const user = await getCurrentUser();
  const warehouse = await prisma.warehouse.findFirst({
    where: { userId: user.id, isDefault: true },
  });
  return warehouse;
}

export async function createWarehouse(formData: FormData) {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:warehouse:create:",
    limit: 20,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    throw new Error(
      `Too many requests. Try again in ${rl.retryAfterSeconds}s.`
    );
  }

  const data = parseWarehouseData(formData);
  const existingDefault = await prisma.warehouse.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  if (!data.isDefault && !existingDefault) {
    data.isDefault = true;
  }

  try {
    await prisma.$transaction(async (tx) => {
      const warehouse = await tx.warehouse.create({
        data: {
          name: data.name,
          location: data.location,
          isDefault: data.isDefault ?? false,
          userId: user.id,
        },
      });

      if (data.isDefault) {
        await tx.warehouse.updateMany({
          where: {
            userId: user.id,
            id: { not: warehouse.id },
          },
          data: { isDefault: false },
        });
      }

      await logActivity(tx, user.id, {
        entityType: "WAREHOUSE",
        actionType: "ADDED",
        entityId: warehouse.id,
        entityName: warehouse.name,
        message: `Created warehouse "${warehouse.name}"`,
      });

      return { warehouse: warehouse };
    });
  } catch (error) {
    console.log("Create warehouse error: ", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create warehouse: ${error.message}`);
    }
    throw new Error("Failed to create warehouse due to an unknown error.");
  }
}
