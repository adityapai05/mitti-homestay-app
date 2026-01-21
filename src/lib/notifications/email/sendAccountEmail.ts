import { resend, EMAIL_FROM } from "./client";
import { AccountDeactivatedEmail } from "./templates/account/AccountDeactivated";

export async function sendAccountDeactivatedEmail(data: {
  name: string;
  email: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.email,
    subject: "MITTI: Account deactivated",
    react: AccountDeactivatedEmail({ name: data.name }),
  });
}
