"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateProject(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/photography");

  if (slug) {
    revalidatePath(`/work/${slug}`);
  }

  revalidateTag("projects");
}

export async function revalidateSiteInfo() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/photography");
  revalidatePath("/contact");

  revalidateTag("site-info");
}
