import {
  EMAIL_COLORS,
  EMAIL_FONTS,
  escapeHtml,
  nl2br,
  renderShell,
} from "./shell";

type AdminNotificationInput = {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Pacific/Tahiti",
  }).format(date);
}

export function buildAdminNotificationSubject(name: string): string {
  return `Nouveau message de ${name} — cestmoitia`;
}

export function buildAdminNotificationHtml({
  name,
  email,
  message,
  submittedAt,
}: AdminNotificationInput): string {
  const { display, body } = EMAIL_FONTS;
  const formattedDate = formatDate(submittedAt);
  const mailtoHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    `Re: votre message — cestmoitia`,
  )}`;

  const content = `
    <p style="margin:0 0 8px 0;font-family:${display};font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${EMAIL_COLORS.accentRed};">
      NOUVELLE DEMANDE
    </p>
    <p style="margin:0 0 32px 0;font-family:${body};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.textMuted};">
      Une nouvelle demande de contact vient d&rsquo;&ecirc;tre envoy&eacute;e
      depuis le formulaire de cestmoitia.com.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:10px;margin-bottom:16px;">
      <tr>
        <td style="padding:24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-bottom:20px;">
                <p style="margin:0 0 6px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                  NOM
                </p>
                <p style="margin:0;font-family:${display};font-size:18px;font-weight:600;text-transform:uppercase;color:${EMAIL_COLORS.text};">
                  ${escapeHtml(name)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 0;border-top:1px solid ${EMAIL_COLORS.border};">
                <p style="margin:0 0 6px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                  EMAIL
                </p>
                <p style="margin:0;font-family:${body};font-size:15px;color:${EMAIL_COLORS.text};">
                  <a href="mailto:${escapeHtml(email)}" style="color:${EMAIL_COLORS.accentBlue};text-decoration:none;">
                    ${escapeHtml(email)}
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;border-top:1px solid ${EMAIL_COLORS.border};">
                <p style="margin:0 0 6px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
                  RE&Ccedil;U LE
                </p>
                <p style="margin:0;font-family:${body};font-size:15px;color:${EMAIL_COLORS.textMuted};">
                  ${escapeHtml(formattedDate)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-left:2px solid ${EMAIL_COLORS.accentRed};border-radius:10px;margin-bottom:32px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 12px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
            MESSAGE
          </p>
          <p style="margin:0;font-family:${body};font-size:16px;line-height:1.7;color:${EMAIL_COLORS.text};white-space:pre-wrap;">
            ${nl2br(message)}
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
      <tr>
        <td align="center" style="border-radius:60px;background-color:${EMAIL_COLORS.text};">
          <a href="${mailtoHref}" style="display:inline-block;padding:16px 32px;font-family:${display};font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${EMAIL_COLORS.bg};text-decoration:none;border-radius:60px;">
            R&eacute;pondre &agrave; ${escapeHtml(name)} &rarr;
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:32px 0 0 0;font-family:${body};font-size:12px;line-height:1.6;color:${EMAIL_COLORS.textSecondary};text-align:center;">
      R&eacute;pondez directement &agrave; cet email : le champ &laquo;&nbsp;r&eacute;pondre &agrave;&nbsp;&raquo;
      pointe d&eacute;j&agrave; vers ${escapeHtml(email)}.
    </p>
  `;

  return renderShell({
    previewText: `${name} (${email}) vient de vous contacter via le site.`,
    title: "NOUVEAU MESSAGE",
    body: content,
    eyebrow: "CESTMOITIA · ADMIN",
  });
}

export function buildAdminNotificationText({
  name,
  email,
  message,
  submittedAt,
}: AdminNotificationInput): string {
  return [
    "CESTMOITIA — NOUVELLE DEMANDE DE CONTACT",
    "",
    `Nom    : ${name}`,
    `Email  : ${email}`,
    `Reçu le: ${formatDate(submittedAt)}`,
    "",
    "— Message —",
    message,
    "",
    `Répondre : mailto:${email}`,
  ].join("\n");
}
