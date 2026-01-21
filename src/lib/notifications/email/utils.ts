import { render } from "@react-email/render";
import { transporter } from "./transporter";
import { EMAIL_FROM } from "./client";
import type React from "react";

export async function sendEmail(options: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  const html = await render(options.react);

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html,
  });
}

export function resolveEmail(email?: string | null): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  return trimmed.length > 0 ? trimmed : null;
}
