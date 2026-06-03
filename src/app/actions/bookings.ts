"use server";

import prisma from "@/lib/prisma";
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
    const booking = await prisma.booking.create({
      data: {
        client_id: data.client_id,
        name: data.name,
        package_type: data.package_type,
        event_date: data.event_date,
        amount: data.amount,
        advance_paid: data.advance_paid,
        status: data.status,
      }
    });
    
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
    const bookings = await prisma.booking.findMany({
      orderBy: { created_at: "desc" }
    });
    return bookings;
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error.message);
    return [];
  }
}

export async function updateBooking(id: string, updates: Partial<{ status: string; advance_paid: number }>) {
  try {
    await prisma.booking.update({
      where: { id },
      data: updates
    });
    
    revalidatePath("/admin/bookings");
    revalidatePath("/client");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Update Booking Error:", error.message);
    return { success: false, error: "Database update failed." };
  }
}
