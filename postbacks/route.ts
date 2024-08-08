import { NextResponse } from "next/server";
import prisma from "../prisma/client";

export async function GET() {
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // Ustawiamy godzinę na 00:00:00.000 UTC dzisiejszego dnia

    const data = await prisma.postback.findMany({
      where: {
        datetime: {
          gte: startOfDay,
        },
      },
      select: {
        offer_name: true,
        offer_id: true,
        payout: true,
        datetime: true,
      },
      orderBy: {
        datetime: "desc",
      },
    });

    console.log("Fetched data:", data); // Logowanie danych
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error); // Logowanie błędu
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
