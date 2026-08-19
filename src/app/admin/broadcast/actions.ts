"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveDraft(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    status: "draft",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/broadcast");
}
