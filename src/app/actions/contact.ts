"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitContactMessage(data: {
  first_name: string;
  last_name: string;
  email: string;
  message: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('contact_messages').insert([{
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      message: data.message,
    }]);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Contact Form Error:", error.message);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}
