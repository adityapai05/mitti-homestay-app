import * as React from "react";
import { BaseEmailLayout } from "@/lib/notifications/email/BaseEmailLayout";

type Props = {
  name: string;
};

export function AccountDeactivatedEmail({ name }: Props) {
  return (
    <BaseEmailLayout title="Your MITTI account has been deactivated">
      <p>Hello {name},</p>

      <p>
        Your MITTI account has been successfully deactivated. You will no longer
        be able to access bookings, listings, or dashboards.
      </p>

      <p>
        If this was a mistake or you wish to reactivate your account, please
        contact our support team.
      </p>

      <p>Thank you for being part of MITTI.</p>
    </BaseEmailLayout>
  );
}
