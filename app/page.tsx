import { createClient } from "@/utils/supabase/server";

export default async function Conversions() {
  const supabase = createClient();

  const { data: conversions, error } = await supabase.from("conversions").select();

  if (error) {
    console.error("Error fetching conversions:", error);
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return <pre>{JSON.stringify(conversions, null, 2)}</pre>;
}
