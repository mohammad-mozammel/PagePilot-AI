// app/api/auth-test/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  console.log("Auth test userId:", userId);

  return NextResponse.json({
    authenticated: !!userId,
    userId,
  });
}