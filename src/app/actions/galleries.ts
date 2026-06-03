"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGallery(data: {
  name: string;
  slug: string;
  date: string;
  status: string;
}) {
  try {
    const supabase = await createClient();
    const { data: gallery, error } = await supabase.from('galleries').insert([{
      name: data.name,
      slug: data.slug,
      date: data.date,
      status: data.status,
    }]).select().single();

    if (error) throw error;
    
    revalidatePath("/admin/galleries");
    revalidatePath("/client");
    
    return { success: true, gallery };
  } catch (error: any) {
    console.error("Gallery Creation Error:", error.message);
    return { success: false, error: "Database error. Please try again." };
  }
}

export async function getGalleries() {
  try {
    const supabase = await createClient();
    const { data: galleries, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return galleries || [];
  } catch (error: any) {
    console.error("Fetch Galleries Error:", error.message);
    return [];
  }
}

