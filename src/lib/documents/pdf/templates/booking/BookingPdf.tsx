/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import { BasePdfLayout } from "../BasePdfLayout";
import { BookingPdfData } from "../../types";

export function BookingPdf({ data }: { data: BookingPdfData }) {
  return (
    <BasePdfLayout>
      {/* INNER COLUMN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/mitti-logo-stacked.png`}
            alt="MITTI"
            style={{ height: 36, marginBottom: 8 }}
          />

          <h1 style={{ margin: 0, fontSize: 24 }}>Booking Confirmed</h1>

          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6B6B6B" }}>
            Booking ID: {data.bookingId}
          </p>
        </div>

        {/* MAIN CONTENT */}
        <table style={{ width: "100%", marginBottom: 28 }}>
          <tbody>
            <tr>
              {/* LEFT */}
              <td
                style={{ width: "60%", verticalAlign: "top", paddingRight: 24 }}
              >
                <h2 style={{ marginBottom: 4 }}>{data.homestay.name}</h2>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 0 }}>
                  {data.homestay.address}
                </p>

                {data.homestay.images[0] && (
                  <img
                    src={data.homestay.images[0]}
                    alt="Homestay"
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 14,
                      margin: "16px 0",
                    }}
                  />
                )}

                <table style={{ fontSize: 12, width: "100%" }}>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Check-in</strong>
                      </td>
                      <td>{data.checkIn.toDateString()}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Check-out</strong>
                      </td>
                      <td>{data.checkOut.toDateString()}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Nights</strong>
                      </td>
                      <td>{data.nights}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Guests</strong>
                      </td>
                      <td>{data.guests}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Check-in time</strong>
                      </td>
                      <td>{data.homestay.checkInTime}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Check-out time</strong>
                      </td>
                      <td>{data.homestay.checkOutTime}</td>
                    </tr>
                  </tbody>
                </table>
              </td>

              {/* RIGHT */}
              <td style={{ width: "40%", verticalAlign: "top" }}>
                <div
                  style={{
                    border: "1px solid #E6E2D3",
                    borderRadius: 14,
                    padding: 18,
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>Price breakdown</h3>

                  <table style={{ width: "100%", fontSize: 12 }}>
                    <tbody>
                      <tr>
                        <td>
                          ₹{data.pricing.pricePerNight.toString()} ×{" "}
                          {data.pricing.nights} nights
                        </td>
                        <td style={{ textAlign: "right" }}>
                          ₹{data.pricing.subtotal.toString()}
                        </td>
                      </tr>

                      <tr>
                        <td>GST ({data.pricing.gstRate}%)</td>
                        <td style={{ textAlign: "right" }}>
                          ₹{data.pricing.gstAmount.toString()}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={2}>
                          <hr />
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>Total paid</strong>
                        </td>
                        <td
                          style={{ textAlign: "right", fontWeight: 700 }}
                        >
                          ₹{data.pricing.total.toString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {data.payment && (
                    <div style={{ marginTop: 12, fontSize: 12 }}>
                      <strong>Payment details</strong>
                      <div>Method: Razorpay</div>
                      <div>Payment ID: {data.payment.paymentId}</div>
                      <div>Paid on: {data.payment.paidAt.toDateString()}</div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 12 }}>
                  <strong>{data.homestay.cancellationPolicyText.title}</strong>
                  <p style={{ marginTop: 6, lineHeight: 1.5 }}>
                    {data.homestay.cancellationPolicyText.description}
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* CONTACTS */}
        <hr style={{ margin: "24px 0" }} />

        <table style={{ width: "100%", fontSize: 12 }}>
          <tbody>
            <tr>
              <td>
                <strong>Guest</strong>
                <br />
                {data.guest.name}
                <br />
                {data.guest.email}
              </td>
              <td>
                <strong>Host</strong>
                <br />
                {data.host.name}
                <br />
                {data.host.email}
                <br />
                {data.host.phone}
              </td>
            </tr>
          </tbody>
        </table>

        {/* FLEX SPACER */}
        <div style={{ flexGrow: 1 }} />

        {/* LEGAL – STUCK TO BOTTOM */}
        <p style={{ fontSize: 10, color: "#8C8E98" }}>
          Please carry a valid government-issued ID during check-in. MITTI acts
          as a booking platform. All cancellations and refunds are governed by
          the policy selected at the time of booking.
        </p>
      </div>
    </BasePdfLayout>
  );
}
