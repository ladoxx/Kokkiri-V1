import { NextResponse } from "next/server";
import { getUiSettings } from "@/lib/data/ui-settings-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = getUiSettings();
  return NextResponse.json(settings);
}
