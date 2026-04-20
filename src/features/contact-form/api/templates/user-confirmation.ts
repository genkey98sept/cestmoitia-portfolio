import {
  EMAIL_COLORS,
  EMAIL_FONTS,
  escapeHtml,
  nl2br,
  renderShell,
} from "./shell";

type UserConfirmationInput = {
  name: string;
  email: string;
  message: string;
};

export function buildUserConfirmationSubject(): string {
  return "Merci pour votre message — cestmoitia";
}

export function buildUserConfirmationHtml({
  name,
  email,
  message,
}: UserConfirmationInput): string {
  const { display, body } = EMAIL_FONTS;

  const content = `
    <p style="margin:0 0 8px 0;font-family:${display};font-size:12px;font-weight:600;letter-spacing:1.4px;text-transform:uppercase;color:${EMAIL_COLORS.accentGreen};">
      MESSAGE RE&Ccedil;U
    </p>
    <p style="margin:0 0 24px 0;font-family:${body};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.text};">
      Bonjour ${escapeHtml(name)},
    </p>
    <p style="margin:0 0 16px 0;font-family:${body};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.textMuted};">
      Votre message est bien arriv&eacute;. Je m&rsquo;en occupe personnellement
      et je reviens vers vous dans les plus brefs d&eacute;lais &mdash;
      g&eacute;n&eacute;ralement sous 24 &agrave; 48 heures.
    </p>
    <p style="margin:0 0 32px 0;font-family:${body};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.textMuted};">
      En attendant, voici un r&eacute;capitulatif de votre demande.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_COLORS.card};border:1px solid ${EMAIL_COLORS.border};border-radius:10px;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 6px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
            DE
          </p>
          <p style="margin:0 0 4px 0;font-family:${display};font-size:16px;font-weight:600;text-transform:uppercase;color:${EMAIL_COLORS.text};">
            ${escapeHtml(name)}
          </p>
          <p style="margin:0 0 20px 0;font-family:${body};font-size:14px;color:${EMAIL_COLORS.textMuted};">
            ${escapeHtml(email)}
          </p>

          <div style="height:1px;background-color:${EMAIL_COLORS.border};margin:20px 0;"></div>

          <p style="margin:0 0 10px 0;font-family:${display};font-size:11px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.textSecondary};">
            VOTRE MESSAGE
          </p>
          <p style="margin:0;font-family:${body};font-size:15px;line-height:1.65;color:${EMAIL_COLORS.text};white-space:pre-wrap;">
            ${nl2br(message)}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:40px 0 4px 0;font-family:${body};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.textMuted};">
      &Agrave; tr&egrave;s vite,
    </p>
    <p style="margin:0;font-family:${display};font-size:18px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:${EMAIL_COLORS.text};">
      TIA
    </p>
  `;

  return renderShell({
    previewText: `Votre message est bien arrivé, ${name}. Je vous recontacte très vite.`,
    title: "MERCI !",
    body: content,
  });
}

export function buildUserConfirmationText({
  name,
  email,
  message,
}: UserConfirmationInput): string {
  return [
    "CESTMOITIA — MESSAGE REÇU",
    "",
    `Bonjour ${name},`,
    "",
    "Votre message est bien arrivé. Je m'en occupe personnellement et je reviens vers vous dans les plus brefs délais — généralement sous 24 à 48 heures.",
    "",
    "— Récapitulatif —",
    `De : ${name} <${email}>`,
    "",
    "Message :",
    message,
    "",
    "À très vite,",
    "Tia",
    "",
    "cestmoitia.com · Puna'auia, Tahiti",
  ].join("\n");
}
