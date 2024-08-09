"use client";
// src/components/Conversions.tsx
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

// src/components/Conversions.tsx

interface Conversion {
  id: number;
  offer_id: any;
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
}

const Conversions = () => {
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

    // Subscribe to real-time changes
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

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(conversions, null, 2)}</pre>;
};

export default Conversions;
