// Ancien texte de remplacement importé avec certains médias du portfolio.
export function normalizeMediaText(value?: string | null): string {
  const text = value?.trim() || "";
  return /^404 error$/i.test(text) ? "" : text;
}
