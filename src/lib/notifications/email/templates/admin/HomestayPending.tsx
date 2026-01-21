import * as React from "react";
import { BaseEmailLayout } from "@/lib/notifications/email/BaseEmailLayout";

type Props = {
  homestayName: string;
  hostName: string;
};

export function HomestayPendingEmail({ homestayName, hostName }: Props) {
  return (
    <BaseEmailLayout title="New homestay pending verification">
      <p>Hello Admin,</p>

      <p>
        A new homestay <strong>{homestayName}</strong> has been submitted by{" "}
        <strong>{hostName}</strong> and is pending verification.
      </p>

      <p>Please review the listing in the admin dashboard and take action.</p>
    </BaseEmailLayout>
  );
}
