// src/app/api/conversions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    // Parse URL search parameters
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

    // Simple validation
    if (!offer_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert data into Supabase
    const { data, error } = await supabase.from("conversions").insert([
      {
        offer_id: offer_id,
        offer_name: offer_name || null,
        affiliate_id: affiliate_id || null,
        source: source || null,
        session_ip: session_ip || null,
        payout: payout ? parseFloat(payout) : null,
        aff_sub: aff_sub || null,
        aff_sub2: aff_sub2 || null,
        aff_sub3: aff_sub3 || null,
        aff_sub4: aff_sub4 || null,
        aff_sub5: aff_sub5 || null,
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
      return NextResponse.json({ error: "Failed to save postback" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to save postback" }, { status: 500 });
  }
}
