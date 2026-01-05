import { Resend } from "resend";
import { ContactEmailTemplate } from "./ContactEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { error } = await resend.emails.send({
    from: "MITTI <no-reply@resend.dev>",
    to: [process.env.CONTACT_RECEIVER_EMAIL as string],
    subject: `MITTI Contact: ${data.subject}`,
    react: ContactEmailTemplate(data),
  });

  if (error) {
    throw new Error(error.message);
  }
}
