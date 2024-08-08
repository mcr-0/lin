import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { offer_id, offer_name, affiliate_id, source, session_ip, payout, datetime, aff_sub, aff_sub2, aff_sub3, aff_sub4, aff_sub5 } = req.query;

    // Simple validation
    if (!offer_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const postback = await prisma.postback.create({
        data: {
          offer_id: offer_id as string,
          offer_name: offer_name as string,
          affiliate_id: affiliate_id as string,
          source: source as string,
          session_ip: session_ip as string,
          payout: payout ? parseFloat(payout as string) : undefined,
          datetime: datetime ? new Date(datetime as string) : undefined,
          aff_sub: aff_sub as string,
          aff_sub2: aff_sub2 as string,
          aff_sub3: aff_sub3 as string,
          aff_sub4: aff_sub4 as string,
          aff_sub5: aff_sub5 as string,
        },
      });
      res.status(200).json(postback);
    } catch (error) {
      res.status(500).json({ error: "Failed to save postback" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
