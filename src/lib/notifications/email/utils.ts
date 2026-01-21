import { DEV_EMAIL_OVERRIDE } from "./config";

export function canSendEmail(email?: string | null): email is string {
  return typeof email === "string" && email.length > 5;
}

export function resolveEmail(recipientEmail?: string | null) {
  if (!recipientEmail) return null;
  if (DEV_EMAIL_OVERRIDE) return DEV_EMAIL_OVERRIDE;
  return recipientEmail;
}
