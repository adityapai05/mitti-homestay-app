import * as React from "react";
import { BaseEmailLayout } from "../../BaseEmailLayout";

type Props = {
  recipientName: string;
  homestayName: string;
  pricing: {
    stayBase: string;
    guideFee: string;
    platformFee: string;
    gst: string;
    subtotal: string;
    total: string;
  };
  pdfUrl?: string;
};

export function BookingApprovedEmail({
  recipientName,
  homestayName,
  pricing,
  pdfUrl,
}: Props) {
  return (
    <BaseEmailLayout title="Booking approved">
      <p>Hello {recipientName},</p>

      <p>
        Your booking request for <strong>{homestayName}</strong> has been
        approved by the host.
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
            <td>Stay base</td>
            <td style={{ textAlign: "right" }}>₹{pricing.stayBase}</td>
          </tr>
          {Number(pricing.guideFee) > 0 && (
            <tr>
              <td>Guide fee</td>
              <td style={{ textAlign: "right" }}>₹{pricing.guideFee}</td>
            </tr>
          )}
          <tr>
            <td>Platform fee</td>
            <td style={{ textAlign: "right" }}>₹{pricing.platformFee}</td>
          </tr>
          <tr>
            <td>GST</td>
            <td style={{ textAlign: "right" }}>₹{pricing.gst}</td>
          </tr>
          <tr>
            <td>Subtotal</td>
            <td style={{ textAlign: "right" }}>₹{pricing.subtotal}</td>
          </tr>
          <tr>
            <td>
              <strong>Total</strong>
            </td>
            <td style={{ textAlign: "right", fontWeight: 600 }}>
              ₹{pricing.total}
            </td>
          </tr>
        </tbody>
      </table>

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
