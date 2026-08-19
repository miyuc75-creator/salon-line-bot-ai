"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMenus() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menus")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createMenu(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("menus").insert({
    name: formData.get("name") as string,
    price: Number(formData.get("price")),
    description: (formData.get("description") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}

export async function updateMenu(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menus")
    .update({
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      description: (formData.get("description") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}

export async function deleteMenu(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menus")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/menu");
}
