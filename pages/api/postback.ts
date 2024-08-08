import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    const { id: offer_id, offer_name, affiliate_id, source, session_ip, payout, datetime, session_timestamp, aff_sub, aff_sub2, aff_sub3, aff_sub4, aff_sub5 } = req.query;

    // Simple validation
    if (!session_ip) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const postback = await prisma.postback.create({
        data: {
          offer_id,
          offer_name,
          affiliate_id,
          source,
          session_ip,
          payout: parseFloat(payout),
          datetime,
          aff_sub,
          aff_sub2,
          aff_sub3,
          aff_sub4,
          aff_sub5,
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
