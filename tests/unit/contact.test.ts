import assert from "node:assert/strict";
import { test } from "node:test";
import { sendContactEmail } from "../../src/features/contact-form/api/send-email";

function validForm() {
  const data = new FormData();
  data.set("name", "Test local");
  data.set("email", "test@example.com");
  data.set("message", "Vérification locale du formulaire.");
  return data;
}

test("invalid submissions are rejected before sending", async () => {
  assert.deepEqual(await sendContactEmail(new FormData()), {
    success: false, error: "Données invalides",
  });
});

test("honeypot submissions never need an email service", async () => {
  const form = validForm();
  form.set("honeypot", "spam");
  assert.deepEqual(await sendContactEmail(form), { success: true, data: null });
});

test("a missing Resend key returns an error without crashing or sending", async () => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const result = await sendContactEmail(validForm());
    assert.equal(result.success, false);
    if (!result.success) assert.match(result.error, /temporairement indisponible/);
  } finally {
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  }
});
