import { resend, EMAIL_FROM } from "./client";
import { ContactEmailTemplate } from "./ContactEmailTemplate";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: process.env.CONTACT_RECEIVER_EMAIL as string,
    subject: `MITTI Contact: ${data.subject}`,
    react: ContactEmailTemplate(data),
  });
}
