import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.union([
  z.strictObject({ global: z.literal("site-info") }),
  z.strictObject({
    collection: z.literal("projects"),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  }),
  z.strictObject({ collection: z.literal("gallery") }),
  z.strictObject({}),
]);

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidation-secret");

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid revalidation target" }, { status: 400 });
  }
  const body = parsed.data;
  const global = "global" in body ? body.global : undefined;
  const collection = "collection" in body ? body.collection : undefined;
  const slug = "slug" in body ? body.slug : undefined;

  if (global === "site-info") {
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/photography");
    revalidatePath("/contact");
    revalidateTag("site-info", { expire: 0 });

    return NextResponse.json({ revalidated: true, scope: "site-info" });
  }

  if (collection === "projects") {
    revalidatePath("/sitemap.xml");
    revalidatePath("/");
    revalidatePath("/work");
    revalidatePath("/photography");

    if (slug) {
      revalidatePath(`/work/${slug}`);
    }

    revalidateTag("projects", { expire: 0 });

    return NextResponse.json({
      revalidated: true,
      scope: "projects",
      slug: slug ?? null,
    });
  }

  if (collection === "gallery") {
    revalidatePath("/photography");
    revalidateTag("gallery", { expire: 0 });
    return NextResponse.json({ revalidated: true, scope: "gallery" });
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, scope: "all" });
}
