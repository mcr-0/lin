"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Definiowanie typu dla postback
type Postback = {
  offer_name: string;
  offer_id: number;
  payout: number;
  createdat: string;
};

const fetchHourlyStats = async (): Promise<number[]> => {
  const response = await fetch("/api/conversions");
  if (!response.ok) {
    throw new Error("Network response was not ok...");
  }
  const data: Postback[] = await response.json();
  const stats = Array(24).fill(0);
  data.forEach(({ payout, createdat }) => {
    const date = new Date(createdat);
    const hour = date.getUTCHours(); // Uzyskujemy godzinę z daty
    stats[hour] += payout; // Sumujemy payout dla danej godziny
  });
  return stats;
};

const HourlyPayoutBarChart: React.FC = () => {
  const [hourlyStats, setHourlyStats] = useState<number[]>(Array(24).fill(0));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHourlyStats()
      .then((stats) => {
        setHourlyStats(stats);
        setError(null);
      })
      .catch((error) => {
        setError("Failed to fetch data");
        console.error("Fetch error:", error);
      });

    const interval = setInterval(() => {
      fetchHourlyStats()
        .then((stats) => {
          setHourlyStats(stats);
          setError(null);
        })
        .catch((error) => {
          setError("Failed to fetch data");
          console.error("Fetch error:", error);
        });
    }, 30000); // 30000 ms = 30 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = hourlyStats.map((payout, hour) => ({
    hour: `${hour}:00`,
    payout,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Payout Chart</CardTitle>
        <CardDescription>Showing payout statistics for each hour of the day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="payout" fill="var(--chart-1)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Hourly statistics for today</div>
      </CardFooter>
    </Card>
  );
};

export default HourlyPayoutBarChart;
