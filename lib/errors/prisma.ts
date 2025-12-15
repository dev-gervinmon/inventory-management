import { PrismaClientKnownRequestError } from "@/app/generated/prisma/internal/prismaNamespace";

export function handlePrismaError(error: unknown) {
  if (error instanceof PrismaClientKnownRequestError) {
    if ((error as PrismaClientKnownRequestError).code === "P2002") {
      return {
        status: 409,
        message: "Unique constraint failed",
      };
    }

    if ((error as PrismaClientKnownRequestError).code === "P2025") {
      return {
        status: 404,
        message: "Record not found",
      };
    }
  }

  return null;
}
