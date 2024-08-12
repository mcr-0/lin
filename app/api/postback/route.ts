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
  const userid = "user-id-test";

  // Prosta walidacja
  if (!aff_sub2) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const conversions = await prisma.conversions.create({
      data: {
        offer_id: offer_id as string | undefined,
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

    // 2. Sprawdzenie, czy istnieje rekord w Activity z odpowiednim userId i offer_id
    const existingActivity = await prisma.activity.findFirst({
      where: {
        userId: aff_sub5 ?? "",
        offer_id: offer_id ?? "", // Oczekiwany typ string
      },
    });

    if (existingActivity) {
      // 3. Jeśli istnieje, zaktualizuj rekord dodając nową wartość payout
      await prisma.activity.update({
        where: {
          id: existingActivity.id,
        },
        data: {
          payout: {
            increment: conversions.payout ?? 0,
          },
        },
      });
    } else {
      // 4. Jeśli rekord nie istnieje, utwórz nowy
      await prisma.activity.create({
        data: {
          action: "conversion",
          offer_id: offer_id ?? "", // Oczekiwany typ string
          converted: 1,
          timestamp: new Date(),
          userId: aff_sub5 ?? "",
          payout: conversions.payout ?? 0,
        },
      });
    }
    return NextResponse.json(conversions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save postback" }, { status: 500 });
  }
}
