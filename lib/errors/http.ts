import { NextResponse } from "next/server";

type ErrorPayload = {
  error: string;
  details?: Record<string, unknown> | string;
};

export function jsonError(
  message: string,
  status = 400,
  details?: ErrorPayload["details"]
) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function notFound(message = "Not found") {
  return jsonError(message, 404);
}

export function serverError(message = "Internal Server Error") {
  return jsonError(message, 500);
}
