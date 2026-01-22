import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
  pdfUrl?: string;
};

export function BookingApprovedEmail({
  recipientName,
  homestayName,
  pdfUrl,
}: Props) {
  return (
    <BaseEmailLayout title="Booking approved">
      <p>Hello {recipientName},</p>

      <p>
        Your booking request for <strong>{homestayName}</strong> has been
        approved by the host.
      </p>

      {pdfUrl && (
        <a
          href={pdfUrl}
          target="_blank"
          style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: "#8B4513",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: 500,
          }}
        >
          Download booking details (PDF)
        </a>
      )}
    </BaseEmailLayout>
  );
}
