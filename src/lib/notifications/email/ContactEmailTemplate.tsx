import * as React from "react";

type Props = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactEmailTemplate({ name, email, subject, message }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#F4F1E1",
        padding: "40px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        color: "#4B2C20",
      }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            backgroundColor: "#8B4513",
            padding: "24px 28px",
            color: "#FFFFFF",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            MITTI
          </h1>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            New contact form submission
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "28px" }}>
          {/* Intro */}
          <p
            style={{
              margin: "0 0 20px",
              fontSize: "15px",
              color: "#5A3A28",
            }}
          >
            A new message has been submitted through the MITTI website contact
            form.
          </p>

          {/* Details Card */}
          <div
            style={{
              backgroundColor: "#F9F6EE",
              borderRadius: "10px",
              padding: "16px 18px",
              marginBottom: "24px",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
              <strong>Name:</strong> {name}
            </p>
            <p style={{ margin: "0 0 10px", fontSize: "14px" }}>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${email}`}
                style={{ color: "#8B4513", textDecoration: "none" }}
              >
                {email}
              </a>
            </p>
            <p style={{ margin: 0, fontSize: "14px" }}>
              <strong>Subject:</strong> {subject}
            </p>
          </div>

          {/* Message */}
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#8B4513",
              }}
            >
              Message
            </p>

            <div
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6DDC4",
                borderRadius: "10px",
                padding: "18px",
                fontSize: "15px",
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#FBF9F3",
            padding: "16px 20px",
            borderTop: "1px solid #E6DDC4",
            fontSize: "12px",
            color: "#7A5A45",
            textAlign: "center",
          }}
        >
          MITTI · Rural Homestay Platform
          <br />
          This message was sent via the website contact form
        </div>
      </div>
    </div>
  );
}
