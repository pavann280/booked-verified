import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  name: string;
  category: string;
  icon: string;
  duration_minutes: number;
};

export type Provider = {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  slots: string[];
  service_id: string | null;
};

export type Appointment = {
  id: string;
  user_id: string;
  provider_id: string;
  service_name: string;
  category: string;
  appointment_date: string;
  time_slot: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  price: number;
  created_at: string;
};

export const CATEGORIES = [
  "All",
  "Healthcare",
  "Salon & Beauty",
  "Car Wash",
  "Bike Wash",
  "Mechanic",
  "Event Services",
  "Home Services",
] as const;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export async function fetchCatalog() {
  const [{ data: providers, error: pErr }, { data: services, error: sErr }] = await Promise.all([
    supabase.from("providers").select("*").order("name"),
    supabase.from("services").select("*"),
  ]);
  if (pErr) throw pErr;
  if (sErr) throw sErr;
  return {
    providers: (providers ?? []) as Provider[],
    services: (services ?? []) as Service[],
  };
}

export async function fetchBookedSlots(providerId: string, date: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("time_slot")
    .eq("provider_id", providerId)
    .eq("appointment_date", date)
    .neq("status", "Cancelled");
  if (error) throw error;
  return (data ?? []).map((r) => r.time_slot as string);
}

export async function fetchMyAppointments(userId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("appointment_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function fetchAllAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function createBooking(input: {
  userId: string;
  provider: Provider;
  serviceName: string;
  date: string;
  slot: string;
}) {
  const { error } = await supabase.from("appointments").insert({
    user_id: input.userId,
    provider_id: input.provider.id,
    service_name: input.serviceName,
    category: input.provider.category,
    appointment_date: input.date,
    time_slot: input.slot,
    price: input.provider.price,
    status: "Confirmed",
  });
  if (error) {
    if (error.code === "23505") throw new Error("That slot was just taken. Pick another time.");
    throw error;
  }
}

export async function updateAppointmentStatus(id: string, status: Appointment["status"]) {
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function fetchProfilesById(ids: string[]) {
  if (ids.length === 0) return {} as Record<string, string>;
  const { data, error } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const p of data ?? []) map[p.id as string] = (p.full_name as string) || (p.email as string);
  return map;
}