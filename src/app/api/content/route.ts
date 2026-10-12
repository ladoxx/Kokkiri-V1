import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/data/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = getSiteContent();
  return NextResponse.json(content);
}
