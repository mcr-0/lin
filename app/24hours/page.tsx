"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const supabase = createClient();

interface Conversion {
  id: number;
  offer_id: string;
  offer_name?: string;
  affiliate_id?: string;
  source?: string;
  session_ip?: string;
  payout?: number;
  aff_sub?: string;
  aff_sub2?: string;
  aff_sub3?: string;
  aff_sub4?: string;
  aff_sub5?: string;
  createdat: string; // Ensure this field exists
}

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const ConversionsChart = () => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("conversions").select();
      if (error) {
        setError("Error fetching conversions: " + error.message);
      } else {
        setConversions(data);
      }
    };

    fetchData();

    const subscription = supabase
      .channel("public:conversions")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversions" }, (payload) => {
        setConversions((prev) => [...prev, payload.new as Conversion]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "conversions" }, (payload) => {
        setConversions((prev) => prev.map((item) => (item.id === (payload.new as Conversion).id ? (payload.new as Conversion) : item)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "conversions" }, (payload) => {
        setConversions((prev) => prev.filter((item) => item.id !== (payload.old as Conversion).id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const hourlyPayouts = React.useMemo(() => {
    const payoutsByHour: { [key: string]: number } = {};

    conversions.forEach((conversion) => {
      const date = new Date(conversion.createdat);
      const hour = date.getHours();
      const hourKey = `${hour.toString().padStart(2, "0")}:00`;

      if (!payoutsByHour[hourKey]) {
        payoutsByHour[hourKey] = 0;
      }
      payoutsByHour[hourKey] += conversion.payout || 0;
    });

    // Ensure all 24 hours are present
    for (let i = 0; i < 24; i++) {
      const hourKey = `${i.toString().padStart(2, "0")}:00`;
      if (!payoutsByHour[hourKey]) {
        payoutsByHour[hourKey] = 0;
      }
    }

    return Object.keys(payoutsByHour)
      .sort()
      .map((hour) => ({
        hour,
        payout: payoutsByHour[hour],
      }));
  }, [conversions]);

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Hourly Payouts</CardTitle>
          <CardDescription>Showing total payouts for each hour in the last 24 hours</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig} // Add this line to pass the config prop
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={hourlyPayouts}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent className="w-[150px]" nameKey="payout" />} />
            <Bar dataKey="payout" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ConversionsChart;
