import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TrackClickSchema = z.object({
  productId: z.string().min(1, "productId is required").max(100),
  platform: z.enum(["naver", "coupang", "other", "NAVER", "COUPANG"]),
  url: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TrackClickSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "잘못된 요청 파라미터입니다.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { productId, platform, url } = parsed.data;

    try {
      // Increment product outbound click counter
      await prisma.product.update({
        where: { id: productId },
        data: { outboundClicks: { increment: 1 } },
      });

      // Record analytics event
      await prisma.analyticsEvent.create({
        data: {
          eventType: `OUTBOUND_CLICK_${platform.toUpperCase()}`,
          targetUrl: url,
          metadata: { productId, platform },
        },
      });
    } catch {
      // Logging fallback
      console.log(`[OUTBOUND CLICK] Product: ${productId}, Platform: ${platform}, URL: ${url}`);
    }

    return NextResponse.json({ success: true, recorded: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
