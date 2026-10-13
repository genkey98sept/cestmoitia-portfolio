import { expect, test } from "@playwright/test";

test("menu hydration readiness keeps the first interaction usable", async ({
  page,
}) => {
  let releaseScripts: (() => void) | undefined;
  const scriptsBlocked = new Promise<void>((resolve) => {
    releaseScripts = resolve;
  });
  // Reproduire un chargement lent sans dépendre de la vitesse du réseau.
  await page.route("**/_next/static/**", async (route) => {
    if (route.request().resourceType() === "script") await scriptsBlocked;
    await route.continue();
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const opener = page.getByRole("button", { name: "Ouvrir le menu" });
    await expect(opener).toBeDisabled();
    releaseScripts?.();
    await opener.click();
    const menu = page.getByRole("dialog", { name: "Menu de navigation" });
    await expect(menu).toBeVisible();
    await menu.getByRole("button", { name: "Fermer le menu" }).press("Escape");
    await expect(menu).toHaveCount(0);
    await expect(opener).toBeFocused();
  } finally {
    releaseScripts?.();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("public routes render without browser exceptions", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of ["/", "/work", "/photography", "/contact"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.locator("nextjs-portal [data-nextjs-dialog]"),
    ).toHaveCount(0);
    if (process.env.CAPTURE_UI) {
      await page.screenshot({ path: testInfo.outputPath(`${route === "/" ? "home" : route.slice(1)}.png`) });
    }
  }
  expect(errors).toEqual([]);
});

test("menu opens, closes with Escape, and navigates to the gallery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu de navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await menu.getByRole("link", { name: "Galerie" }).click();
  await expect(page).toHaveURL(/\/photography$/);
  await expect(
    page.getByRole("heading", { name: "Galerie", exact: true }),
  ).toBeVisible();
});

test("seeded gallery images load through the CMS and image optimizer", async ({
  page,
}) => {
  await page.goto("/photography");
  const photos = page
    .getByRole("region", { name: "Mosaïque de photos" })
    .locator("img");
  expect(await photos.count()).toBeGreaterThanOrEqual(10);
  await photos.first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      photos
        .first()
        .evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
    )
    .toBe(true);
});

test("contact works locally without an email key or actual sending", async ({
  page,
}) => {
  test.skip(
    Boolean(process.env.RESEND_API_KEY),
    "This test must never send real emails",
  );
  await page.goto("/contact");
  await page
    .getByRole("textbox", { name: "Nom", exact: true })
    .fill("Test local");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("test@example.com");
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("Vérification locale sans envoi de mail.");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  const feedback = page.locator("form").getByRole("alert");
  await expect(feedback).toHaveText(
    "Le formulaire est temporairement indisponible. Réessayez plus tard.",
  );
  await expect(feedback).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Message", exact: true }),
  ).toHaveValue("Vérification locale sans envoi de mail.");
});

test("unknown projects return a 404", async ({ page }) => {
  const response = await page.goto("/work/projet-inexistant-test");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Hors champ.", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Retour à l’accueil", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voir les projets", exact: true }),
  ).toBeVisible();
});

test("unmatched public URLs use the portfolio 404", async ({ page }) => {
  for (const route of ["/page-inexistante-test", "/chemin/inexistant"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Hors champ.", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Retour à l’accueil", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("cestmoitia");
  }
});

test("CMS setup or login is reachable", async ({ page }) => {
  const response = await page.goto("/admin");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
});

test("webhook rejects missing secrets and malformed targets", async ({
  request,
}) => {
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
    expect(await gallery.json()).toEqual({
      revalidated: true,
      scope: "gallery",
    });
  }
});

test("menu traps focus, restores it and remains usable on short screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 360 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Ouvrir le menu" });
  await opener.click();
  const menu = page.getByRole("dialog", { name: "Menu de navigation" });
  const close = menu.getByRole("button", { name: "Fermer le menu" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    menu.getByRole("link", { name: "Expérience", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await menu
    .getByRole("link", { name: "Contact", exact: true })
    .scrollIntoViewIfNeeded();
  await expect(
    menu.getByRole("link", { name: "Contact", exact: true }),
  ).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await opener.click();
  await menu.getByRole("link", { name: "Projets", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Les projets",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("gallery viewer shows complete images and supports arrows, Escape and focus restoration", async ({
  page,
}) => {
  await page.goto("/photography");
  const opener = page.getByRole("button", { name: /^Voir la photo/ }).first();
  await opener.click();
  const viewer = page.getByRole("dialog", { name: "Visionneuse de photos" });
  await expect(viewer).toBeVisible();
  const originalSource = await viewer.locator("img").getAttribute("src");
  await expect(viewer.locator("img")).toHaveCSS("object-fit", "contain");
  await expect(
    viewer.getByRole("button", { name: "Fermer la photo" }),
  ).toBeFocused();
  await viewer.getByRole("button", { name: "Photo suivante" }).click();
  await expect(viewer.locator("img")).not.toHaveAttribute(
    "src",
    originalSource!,
  );
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.locator("img")).toHaveAttribute("src", originalSource!);
  await page.keyboard.press("ArrowRight");
  await expect(viewer.locator("img")).not.toHaveAttribute(
    "src",
    originalSource!,
  );
  await viewer.getByRole("button", { name: "Photo précédente" }).click();
  await expect(viewer.locator("img")).toHaveAttribute("src", originalSource!);
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("contact has visible labels and native required-field validation without sending", async ({
  page,
}) => {
  await page.goto("/contact");
  for (const name of ["Nom", "Email", "Message"]) {
    const input = page.getByRole("textbox", { name, exact: true });
    await expect(input).toBeVisible();
    expect(
      await input.evaluate(
        (node: HTMLInputElement) =>
          node.labels?.[0].getBoundingClientRect().height,
      ),
    ).toBeGreaterThan(0);
  }
  let submissions = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") submissions += 1;
  });
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  await expect(
    page.getByRole("textbox", { name: "Nom", exact: true }),
  ).toBeFocused();
  expect(
    await page
      .locator("#contact-name")
      .evaluate((node: HTMLInputElement) => node.validity.valueMissing),
  ).toBe(true);
  await page
    .getByRole("textbox", { name: "Nom", exact: true })
    .fill("Test local");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("adresse-invalide");
  await page.getByRole("button", { name: "Envoyer le message" }).click();
  expect(
    await page
      .locator("#contact-email")
      .evaluate((node: HTMLInputElement) => node.validity.typeMismatch),
  ).toBe(true);
  expect(submissions).toBe(0);
});

test("reduced motion keeps editorial content visible and routes within the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of ["/", "/work", "/photography", "/contact"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (route === "/") {
        const lines = await page.locator("h1").evaluate(
          (node) =>
            node.getBoundingClientRect().height /
            Number.parseFloat(getComputedStyle(node).lineHeight),
        );
        expect(lines).toBeLessThanOrEqual(1.01);
      }
      const headings = page.locator("main h1, main h2");
      for (const heading of await headings.all()) {
        await heading.scrollIntoViewIfNeeded();
        await expect(heading).toHaveCSS("opacity", "1");
        await expect(heading).toBeVisible();
      }
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    }
  }
});

test("editorial content and photography are server-rendered without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "cestmoitia", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Moi, c’est Tia.", exact: true }),
    ).toBeVisible();
    await expect(
      page
        .getByRole("region", { name: "À propos", exact: true })
        .locator("p")
        .first(),
    ).toBeVisible();
    await page.goto("/photography");
    expect(
      await page
        .getByRole("region", { name: "Mosaïque de photos" })
        .locator("img")
        .count(),
    ).toBeGreaterThanOrEqual(10);
    await expect(
      page.getByRole("button", { name: /^Voir la photo/ }).first(),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("menu section links use one header offset and focus their destination", async ({
  page,
}) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    await page.emulateMedia({ reducedMotion });
    for (const route of ["/", "/contact"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
      const menu = page.getByRole("dialog", { name: "Menu de navigation" });
      await menu
        .getByRole("link", { name: "Services", exact: true })
        .press("Enter");
      await expect(page).toHaveURL(/\/#services$/);
      await expect(menu).toHaveCount(0);
      const target = page.locator("#services");
      await expect(target).toBeFocused();
      await expect
        .poll(() =>
          target.evaluate((node) =>
            Math.abs(node.getBoundingClientRect().top - 90),
          ),
        )
        .toBeLessThanOrEqual(2);
      await page.keyboard.press("Tab");
      await expect(
        target.getByRole("button", { name: "Captation Vidéo", exact: true }),
      ).toBeFocused();
    }
  }
});

test("menu section focus survives an interrupted smooth scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await page
    .getByRole("dialog", { name: "Menu de navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .press("Enter");
  const target = page.locator("#services");
  await expect(target).toBeFocused();
  await page.mouse.wheel(0, 60);
  await expect(target).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    target.getByRole("button", { name: "Captation Vidéo", exact: true }),
  ).toBeFocused();
});

test("contact flags whitespace and email formats rejected by the shared schema without submitting", async ({
  page,
}) => {
  await page.goto("/contact");
  let submissions = 0;
  page.on("request", (request) => {
    if (request.method() === "POST") submissions++;
  });
  const name = page.getByRole("textbox", { name: "Nom", exact: true });
  const email = page.getByRole("textbox", { name: "Email", exact: true });
  const message = page.getByRole("textbox", { name: "Message", exact: true });
  const submit = page.getByRole("button", { name: "Envoyer le message" });
  await name.fill(" a ");
  await email.fill("test@example.com");
  await message.fill("Un message valide pour ce contrôle.");
  await submit.click();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toBeFocused();
  await expect(page.locator("#contact-name-error")).toHaveText(
    "Saisissez un nom d’au moins 2 caractères.",
  );
  await name.fill("Tia");
  await expect(name).not.toHaveAttribute("aria-invalid", "true");
  await email.fill("tia@localhost");
  await message.fill(" bonjour  ");
  await submit.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();
  await expect(page.locator("#contact-email-error")).toHaveText(
    "Saisissez une adresse email valide.",
  );
  await expect(page.locator("#contact-message-error")).toHaveText(
    "Votre message doit contenir au moins 10 caractères.",
  );
  expect(submissions).toBe(0);
});
