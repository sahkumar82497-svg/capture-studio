"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBooking(data: {
  client_id?: string;
  name?: string;
  package_type: string;
  event_date: string;
  amount: number;
  advance_paid: number;
  status: string;
}) {
  try {
    const supabase = await createClient();
    const { data: booking, error } = await supabase.from('bookings').insert([{
      client_id: data.client_id,
      name: data.name,
      package_type: data.package_type,
      event_date: data.event_date,
      amount: data.amount,
      advance_paid: data.advance_paid,
      status: data.status,
    }]).select().single();

    if (error) throw error;
    
    revalidatePath("/admin/bookings");
    revalidatePath("/client");
    revalidatePath("/admin");
    
    return { success: true, booking };
  } catch (error: any) {
    console.error("Booking Creation Error:", error.message);
    return { success: false, error: "Database error. Please try again." };
  }
}

export async function getBookings() {
  try {
    const supabase = await createClient();
    const { data: bookings, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return bookings || [];
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error.message);
    return [];
  }
}

export async function updateBooking(id: string, updates: Partial<{ status: string; advance_paid: number }>) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('bookings').update(updates).eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/bookings");
    revalidatePath("/client");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update Booking Error:", error.message);
    return { success: false, error: "Database update failed." };
  }
}

