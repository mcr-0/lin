"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import moment from "moment-timezone";

// Definiowanie typu dla postback
type Postback = {
  offer_name: string;
  offer_id: number;
  payout: number;
  createdat: string;
};

const fetchInitialStats = async (): Promise<number[]> => {
  const response = await fetch("/api/postbacks");
  if (!response.ok) {
    throw new Error("Network response was not ok...");
  }
  const data: Postback[] = await response.json();
  const stats = Array(24).fill(0);
  data.forEach(({ payout, createdat }) => {
    const date = moment.tz(createdat, "Europe/Warsaw");
    const hour = date.hour(); // Uzyskujemy godzinę w strefie czasowej Warszawy
    stats[hour] += payout; // Sumujemy payout dla danej godziny
  });
  return stats;
};

const HourlyPayoutBarChart: React.FC = () => {
  const [hourlyStats, setHourlyStats] = useState<number[]>(Array(24).fill(0));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await fetchInitialStats();
        setHourlyStats(stats);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const newData: Postback = JSON.parse(event.data);
      const date = moment.tz(newData.createdat, "Europe/Warsaw");
      const hour = date.hour();
      setHourlyStats((prevStats) => {
        const updatedStats = [...prevStats];
        updatedStats[hour] += newData.payout;
        return updatedStats;
      });
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
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
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="payout" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
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
