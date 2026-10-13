import { expect, test } from "@playwright/test";

test("public routes render without browser exceptions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/work", "/photography", "/contact"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("nextjs-portal [data-nextjs-dialog]")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("menu opens, closes with Escape, and navigates to the gallery", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu de navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await menu.getByRole("link", { name: "Galerie" }).click();
  await expect(page).toHaveURL(/\/photography$/);
  await expect(page.getByRole("heading", { name: "GALERIE", exact: true })).toBeVisible();
});

test("seeded gallery images load through the CMS and image optimizer", async ({ page }) => {
  await page.goto("/photography");
  const photos = page.getByRole("region", { name: "Mosaique de photos" }).locator("img");
  expect(await photos.count()).toBeGreaterThanOrEqual(10);
  await photos.first().scrollIntoViewIfNeeded();
  await expect.poll(() => photos.first().evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
});

test("contact works locally without an email key or actual sending", async ({ page }) => {
  test.skip(Boolean(process.env.RESEND_API_KEY), "This test must never send real emails");
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Nom", exact: true }).fill("Test local");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("test@example.com");
  await page.getByRole("textbox", { name: "Message", exact: true }).fill("Vérification locale sans envoi de mail.");
  await page.getByRole("button", { name: "Soumettre" }).click();
  await expect(page.getByText("Le formulaire est temporairement indisponible. Réessayez plus tard.")).toBeVisible();
});

test("unknown projects return a 404", async ({ page }) => {
  const response = await page.goto("/work/projet-inexistant-test");
  expect(response?.status()).toBe(404);
});

test("CMS setup or login is reachable", async ({ page }) => {
  const response = await page.goto("/admin");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
});

test("webhook rejects missing secrets and malformed targets", async ({ request }) => {
  const anonymous = await request.post("/api/revalidate", { data: {} });
  expect(anonymous.status()).toBe(401);
  if (process.env.REVALIDATION_SECRET) {
    const invalid = await request.post("/api/revalidate", {
      headers: { "x-revalidation-secret": process.env.REVALIDATION_SECRET },
      data: null,
    });
    expect(invalid.status()).toBe(400);
    const gallery = await request.post("/api/revalidate", {
      headers: { "x-revalidation-secret": process.env.REVALIDATION_SECRET },
      data: { collection: "gallery" },
    });
    expect(gallery.status()).toBe(200);
    expect(await gallery.json()).toEqual({ revalidated: true, scope: "gallery" });
  }
});
