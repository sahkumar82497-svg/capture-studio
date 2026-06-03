"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBooking(data: {
  client_id?: string;
  name?: string;
  phone?: string;
  venue?: string;
  package_type: string;
  event_date: string;
  amount: number;
  advance_paid: number;
  status: string;
}) {
  try {
    const supabase = await createClient();
    
    // Build insert object with only the core fields first
    const insertData: Record<string, any> = {
      package_type: data.package_type,
      event_date: data.event_date,
      amount: data.amount,
      advance_paid: data.advance_paid,
      status: data.status,
    };
    if (data.client_id) insertData.client_id = data.client_id;
    if (data.name) insertData.name = data.name;
    if (data.phone) insertData.phone = data.phone;
    if (data.venue) insertData.venue = data.venue;

    // Try inserting with all fields first
    let result = await supabase.from('bookings').insert([insertData]).select().single();
    
    // If phone/venue columns don't exist, retry without them
    if (result.error && result.error.message?.includes('column')) {
      delete insertData.phone;
      delete insertData.venue;
      result = await supabase.from('bookings').insert([insertData]).select().single();
    }

    if (result.error) throw result.error;
    
    revalidatePath("/admin/bookings");
    revalidatePath("/client");
    revalidatePath("/admin");
    
    return { success: true, booking: result.data };
  } catch (error: any) {
    console.error("Booking Creation Error:", error.message);
    return { success: false, error: error.message || "Database error. Please try again." };
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

