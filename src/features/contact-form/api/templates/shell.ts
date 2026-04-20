/**
 * Shell HTML commun aux emails — reprend la charte cestmoitia
 * (fond noir, Clash/Inter fallback, accents mesurés).
 * Inline styles uniquement : les clients mail ignorent <style> externe.
 */

type ShellOptions = {
  previewText: string;
  title: string;
  body: string;
  eyebrow?: string;
};

const FONT_DISPLAY =
  '"Helvetica Neue", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const FONT_BODY =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const EMAIL_FONTS = { display: FONT_DISPLAY, body: FONT_BODY };

export const EMAIL_COLORS = {
  bg: "#000000",
  bgAlt: "#0a0a0a",
  card: "#0a0a0a",
  border: "#1f1f1f",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.6)",
  textSecondary: "#808080",
  accentRed: "#ff462e",
  accentGreen: "#14c700",
  accentBlue: "#009dff",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

export function renderShell({
  previewText,
  title,
  body,
  eyebrow = "CESTMOITIA",
}: ShellOptions): string {
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark only" />
    <meta name="supported-color-schemes" content="dark only" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(title)}</title>
    <!--[if mso]>
      <style>
        * { font-family: Arial, sans-serif !important; }
      </style>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;background-color:${EMAIL_COLORS.bg};color:${EMAIL_COLORS.text};-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
    <div style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(previewText)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.bg};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${EMAIL_COLORS.bg};border:1px solid ${EMAIL_COLORS.border};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 24px 32px;border-bottom:1px solid ${EMAIL_COLORS.border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${FONT_DISPLAY};font-size:12px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                      ${escapeHtml(eyebrow)}
                    </td>
                    <td align="right" style="font-family:${FONT_DISPLAY};font-size:12px;font-weight:500;letter-spacing:0.8px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                      PUNA&#39;AUIA &middot; TAHITI
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:48px 32px 16px 32px;">
                <h1 style="margin:0;font-family:${FONT_DISPLAY};font-size:40px;line-height:1;font-weight:700;letter-spacing:-0.5px;text-transform:uppercase;color:${EMAIL_COLORS.text};">
                  ${title}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 40px 32px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:32px;border-top:1px solid ${EMAIL_COLORS.border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:${FONT_DISPLAY};font-size:11px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                      CESTMOITIA.COM
                    </td>
                    <td align="right" style="font-family:${FONT_DISPLAY};font-size:11px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                      &copy; ${year}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0 0;font-family:${FONT_BODY};font-size:11px;line-height:1.5;color:${EMAIL_COLORS.textSecondary};text-align:center;">
            Filmmaker &middot; Graphiste &middot; Motion Designer
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
