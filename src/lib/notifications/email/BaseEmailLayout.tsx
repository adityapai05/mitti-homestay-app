/* eslint-disable @next/next/no-img-element */

import * as React from "react";

type BaseEmailLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function BaseEmailLayout({ title, children }: BaseEmailLayoutProps) {
  return (
    <div
      style={{
        backgroundColor: "#F4F1E1",
        padding: "32px 16px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}/mitti-logo-stacked.png`}
          alt="MITTI"
          width="96"
          height="28"
          style={{
            display: "block",
            marginBottom: "16px",
            border: "0",
            outline: "none",
            textDecoration: "none",
          }}
        />

        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#4B2C20",
            marginBottom: "16px",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            fontSize: "14px",
            color: "#4B2C20",
            lineHeight: "1.6",
          }}
        >
          {children}
        </div>

        <div
          style={{
            marginTop: "32px",
            fontSize: "12px",
            color: "#6B6B6B",
          }}
        >
          <p>
            This email was sent by MITTI, a rural homestay booking platform.
          </p>
          <p>Please do not reply to this email.</p>
        </div>
      </div>
    </div>
  );
}
