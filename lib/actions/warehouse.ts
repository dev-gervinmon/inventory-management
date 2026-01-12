"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/auth";
import { ActionResponse } from "../constants/common";
import prisma from "../db/prisma";
import { parseWarehouseData } from "../schemas/warehouse";
import { actionRequireId } from "../validators/common";
import { logActivity } from "./activities";
import { checkActionRateLimit } from "./rate-limit";
import { handlePrismaActionError } from "../errors/actions";

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

export async function createWarehouse(
  formData: FormData
): Promise<ActionResponse> {
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
    const warehouse = await prisma.$transaction(async (tx) => {
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

      revalidatePath("/warehouses");

      return warehouse;
    });
    return { success: true, data: warehouse };
  } catch (error) {
    console.log("Create warehouse error: ", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create warehouse: ${error.message}`);
    }
    throw new Error("Failed to create warehouse due to an unknown error.");
  }
}

export async function editWarehouse(
  formData: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:warehouse:edit:",
    limit: 60,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const id = actionRequireId(formData);
  const data = parseWarehouseData(formData);

  try {
    const oldWarehouse = await prisma.warehouse.findFirst({
      where: { id, userId: user.id },
    });

    if (!oldWarehouse) {
      return {
        success: false,
        error: "Warehouse not found.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const updatedWarehouse = await tx.warehouse.update({
        where: { id },
        data,
      });

      await logActivity(tx, user.id, {
        entityType: "WAREHOUSE",
        actionType: "EDITED",
        entityId: id,
        entityName: updatedWarehouse.name,
        message: "Warehouse updated.",
        details: {
          before_name: oldWarehouse.name,
          after_name: updatedWarehouse.name,
          before_location: oldWarehouse.location || "",
          after_location: updatedWarehouse.location || "",
        },
      });
    });

    revalidatePath("/warehouses");
    revalidatePath(`/warehouses/${id}`);
  } catch (error) {
    const message = handlePrismaActionError(error, "Warehouse");
    return {
      success: false,
      error: message,
    };
  }

  return {
    success: true,
  };
}

export async function deleteWarehouse(
  formData: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:warehouse:delete:",
    limit: 30,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const id = actionRequireId(formData);

  try {
    const warehouse = await prisma.warehouse.findFirst({
      where: { id, userId: user.id },
    });

    if (!warehouse) {
      return {
        success: false,
        error: "Warehouse not found.",
      };
    }

    if (warehouse.isDefault) {
      return {
        success: false,
        error: "Cannot delete the default warehouse.",
      };
    }

    const warehousesCount = await prisma.warehouse.count({
      where: { userId: user.id },
    });

    if (warehousesCount <= 1) {
      return {
        success: false,
        error: "At least one warehouse must exist.",
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.warehouse.delete({
        where: { id },
      });

      await logActivity(tx, user.id, {
        entityType: "WAREHOUSE",
        actionType: "DELETED",
        entityId: id,
        entityName: warehouse.name,
        message: `Deleted warehouse "${warehouse.name}"`,
      });
    });
  } catch (error) {
    const message = handlePrismaActionError(error, "Warehouse");
    return {
      success: false,
      error: message,
    };
  }

  revalidatePath("/warehouses");
  return {
    success: true,
  };
}

export async function setDefaultWarehouse(
  formData: FormData
): Promise<ActionResponse> {
  const user = await getCurrentUser();

  const rl = await checkActionRateLimit({
    prefix: "action:warehouse:setDefault:",
    limit: 30,
    windowMs: 60_000,
    userId: user.id,
  });
  if (!rl.allowed) {
    return {
      success: false,
      error: `Too many requests. Try again in ${rl.retryAfterSeconds}s.`,
    };
  }

  const id = actionRequireId(formData);
  const warehouse = await prisma.warehouse.findFirst({
    where: { id, userId: user.id },
  });

  if (!warehouse) {
    return {
      success: false,
      error: "Warehouse not found.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.warehouse.updateMany({
        where: { userId: user.id, id: { not: id } },
        data: { isDefault: false },
      });

      const warehouse = await tx.warehouse.update({
        where: { id },
        data: { isDefault: true },
      });

      await logActivity(tx, user.id, {
        entityType: "WAREHOUSE",
        actionType: "EDITED",
        entityId: id,
        entityName: warehouse.name,
        message: `Set warehouse: ${warehouse.name} as default.`,
      });
    });
  } catch (error) {
    const message = handlePrismaActionError(error, "Warehouse");
    return {
      success: false,
      error: message,
    };
  }

  revalidatePath("/warehouses");
  return {
    success: true,
  };
}
