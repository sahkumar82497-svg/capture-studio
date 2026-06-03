"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Sign out error", err);
  }
  
  // Clear all cookies as a fallback to ensure clean state
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
  
  redirect("/");
}
