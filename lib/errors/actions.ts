import { Prisma } from "@/app/generated/prisma/client";

export function handlePrismaActionError(
  error: unknown,
  entityName = "Resource"
) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.[0] || "field";
      throw new Error(`${capitalize(field)} already exists`);
    }
    if (error.code === "P2025") {
      throw new Error(`${entityName} not found`);
    }
  }
  if (error instanceof Error) {
    throw error;
  }
  console.error(`${entityName} action error:`, error);
  throw new Error(`Failed to process ${entityName.toLowerCase()}`);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
