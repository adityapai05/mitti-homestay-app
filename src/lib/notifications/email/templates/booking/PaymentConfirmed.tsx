import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  pdfUrl: string;
};

export function PaymentConfirmedEmail({
  recipientName,
  homestayName,
  location,
  checkIn,
  checkOut,
  pdfUrl,
}: Props) {
  return (
    <BaseEmailLayout title="Booking confirmed">
      <p style={{ marginTop: 0 }}>
        Hello <strong>{recipientName}</strong>,
      </p>

      <p>
        Your stay at <strong>{homestayName}</strong> has been successfully
        confirmed.
      </p>

      <table
        width="100%"
        style={{
          backgroundColor: "#F9F7F1",
          borderRadius: 8,
          padding: 16,
          margin: "16px 0",
          fontSize: 14,
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong>Location</strong>
            </td>
            <td>{location}</td>
          </tr>
          <tr>
            <td>
              <strong>Check-in</strong>
            </td>
            <td>{checkIn}</td>
          </tr>
          <tr>
            <td>
              <strong>Check-out</strong>
            </td>
            <td>{checkOut}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <a
          href={pdfUrl}
          style={{
            backgroundColor: "#8B4513",
            color: "#ffffff",
            padding: "12px 22px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            display: "inline-block",
          }}
        >
          Download Booking Confirmation
        </a>
      </div>

      <p>
        Please keep this document handy during check-in. We wish you a peaceful
        and memorable stay.
      </p>

      <p style={{ marginBottom: 0 }}>
        Warm regards,
        <br />
        <strong>MITTI</strong>
      </p>
    </BaseEmailLayout>
  );
}
