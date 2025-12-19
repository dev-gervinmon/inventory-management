import { Prisma } from "@/app/generated/prisma/client";

export function handlePrismaActionError(
  error: unknown,
  entityName = "Resource"
): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const field = (error.meta?.target as string[])?.[0] || "field";
      return `${capitalize(field)} already exists`;
    }
    if (error.code === "P2025") {
      return `${entityName} not found`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  console.error(`${entityName} action error:`, error);
  return `Failed to process ${entityName.toLowerCase()}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
