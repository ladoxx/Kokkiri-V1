import { NextResponse } from "next/server";
import { getSiteNavigation } from "@/lib/data/navigation-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const nav = getSiteNavigation();
  return NextResponse.json(nav);
}
