import { sendEmail } from "./utils";
import { AccountDeactivatedEmail } from "./templates/account/AccountDeactivated";

export async function sendAccountDeactivatedEmail(data: {
  name: string;
  email: string;
}) {
  await sendEmail({
    to: data.email,
    subject: "MITTI: Account deactivated",
    react: AccountDeactivatedEmail({ name: data.name }),
  });
}
