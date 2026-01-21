import { resend, EMAIL_FROM } from "./client";
import { HomestayPendingEmail } from "./templates/admin/HomestayPending";
import { HostPendingEmail } from "./templates/admin/HostPending";

export async function sendAdminHomestayPendingEmail(data: {
  homestayName: string;
  hostName: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: process.env.CONTACT_RECEIVER_EMAIL as string,
    subject: "MITTI: New homestay pending verification",
    react: HomestayPendingEmail(data),
  });
}

export async function sendAdminHostPendingEmail(data: {
  hostName: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: process.env.CONTACT_RECEIVER_EMAIL as string,
    subject: "MITTI: New host pending verification",
    react: HostPendingEmail(data),
  });
}
