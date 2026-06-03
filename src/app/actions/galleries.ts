"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGallery(data: {
  name: string;
  slug: string;
  date: string;
  status: string;
}) {
  try {
    const gallery = await prisma.gallery.create({
      data: {
        name: data.name,
        slug: data.slug,
        date: data.date,
        status: data.status,
      }
    });
    
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
    const galleries = await prisma.gallery.findMany({
      orderBy: { created_at: "desc" }
    });
    return galleries;
  } catch (error: any) {
    console.error("Fetch Galleries Error:", error.message);
    return [];
  }
}
