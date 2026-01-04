import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function GET() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({ id: user.id });
}
