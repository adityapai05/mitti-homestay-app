import { sendEmail } from "./utils";
import { ContactEmailTemplate } from "./ContactEmailTemplate";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await sendEmail({
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    subject: `MITTI Contact: ${data.subject}`,
    react: ContactEmailTemplate(data),
  });
}
