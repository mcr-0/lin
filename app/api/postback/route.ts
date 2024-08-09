import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offer_id = searchParams.get("offer_id");
  const offer_name = searchParams.get("offer_name");
  const affiliate_id = searchParams.get("affiliate_id");
  const source = searchParams.get("source");
  const session_ip = searchParams.get("session_ip");
  const payout = searchParams.get("payout");

  const aff_sub = searchParams.get("aff_sub");
  const aff_sub2 = searchParams.get("aff_sub2");
  const aff_sub3 = searchParams.get("aff_sub3");
  const aff_sub4 = searchParams.get("aff_sub4");
  const aff_sub5 = searchParams.get("aff_sub5");

  // Prosta walidacja
  if (!aff_sub2) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const postback = await prisma.conversions.create({
      data: {
        offer_id: offer_id as any,
        offer_name: offer_name as string | undefined,
        affiliate_id: affiliate_id as string | undefined,
        source: source as string | undefined,
        session_ip: session_ip as string | undefined,
        payout: payout ? parseFloat(payout as string) : undefined,

        aff_sub: aff_sub as string | undefined,
        aff_sub2: aff_sub2 as string | undefined,
        aff_sub3: aff_sub3 as string | undefined,
        aff_sub4: aff_sub4 as string | undefined,
        aff_sub5: aff_sub5 as string | undefined,
      },
    });
    return NextResponse.json(postback);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save postback" }, { status: 500 });
  }
}
