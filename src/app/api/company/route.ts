import { NextResponse } from "next/server";
import { getCompanyInfo } from "@/lib/data/company-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const company = getCompanyInfo();
    return NextResponse.json(company);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching company info";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
