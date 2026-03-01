import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: { collection?: string; slug?: string; global?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { collection, slug, global } = body;

  if (global === "site-info") {
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/photography");
    revalidatePath("/contact");
    revalidateTag("site-info");

    return NextResponse.json({ revalidated: true, scope: "site-info" });
  }

  if (collection === "projects") {
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/photography");

    if (slug) {
      revalidatePath(`/work/${slug}`);
    }

    revalidateTag("projects");

    return NextResponse.json({
      revalidated: true,
      scope: "projects",
      slug: slug ?? null,
    });
  }

  revalidatePath("/");

  return NextResponse.json({ revalidated: true, scope: "all" });
}
