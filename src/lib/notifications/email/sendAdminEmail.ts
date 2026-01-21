import { sendEmail } from "./utils";
import { HomestayPendingEmail } from "./templates/admin/HomestayPending";
import { HostPendingEmail } from "./templates/admin/HostPending";

export async function sendAdminHomestayPendingEmail(data: {
  homestayName: string;
  hostName: string;
}) {
  await sendEmail({
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    subject: "MITTI: New homestay pending verification",
    react: HomestayPendingEmail(data),
  });
}

export async function sendAdminHostPendingEmail(data: { hostName: string }) {
  await sendEmail({
    to: process.env.CONTACT_RECEIVER_EMAIL!,
    subject: "MITTI: New host pending verification",
    react: HostPendingEmail(data),
  });
}
