import { NextResponse } from "next/server";
import { handlePrismaError } from "@/lib/errors/prisma";
import { serverError, jsonError } from "@/lib/errors/http";

type Handler<T = unknown, C = unknown> = (
  req: Request,
  context?: C
) => Promise<NextResponse<T>> | NextResponse<T>;

export function withApiHandler<C = unknown>(handler: Handler<unknown, C>) {
  return async (req: Request, context?: C) => {
    try {
      const res = await handler(req, context as C);
      return res;
    } catch (error: unknown) {
      const prisma = handlePrismaError(error);
      if (prisma) {
        return jsonError(prisma.message, prisma.status);
      }
      return serverError();
    }
  };
}
