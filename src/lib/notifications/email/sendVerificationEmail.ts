import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "./client";
import { canSendEmail, resolveEmail } from "./utils";

import { HostVerifiedEmail } from "./templates/verification/HostVerified";
import { HostRejectedEmail } from "./templates/verification/HostRejected";
import { HomestayVerifiedEmail } from "./templates/verification/HomestayVerified";
import { HomestayRejectedEmail } from "./templates/verification/HomestayRejected";

import { VerificationEmailType } from "./types";

export async function sendVerificationEmail(
  type: VerificationEmailType,
  payload: {
    userId?: string;
    homestayId?: string;
    reason?: string;
  }
) {
  if (type === "HOST_VERIFIED" || type === "HOST_REJECTED") {
    if (!payload.userId) return;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !canSendEmail(user.email)) return;

    const to = resolveEmail(user.email);
    if (!to) return; 

    if (type === "HOST_VERIFIED") {
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: "MITTI: Host verification approved",
        react: HostVerifiedEmail({
          name: user.name,
        }),
      });
    }

    if (type === "HOST_REJECTED") {
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: "MITTI: Host verification rejected",
        react: HostRejectedEmail({
          name: user.name,
          reason: payload.reason ?? "",
        }),
      });
    }
  }

  if (type === "HOMESTAY_VERIFIED" || type === "HOMESTAY_REJECTED") {
    if (!payload.homestayId) return;

    const homestay = await prisma.homestay.findUnique({
      where: { id: payload.homestayId },
      include: {
        owner: true,
      },
    });

    if (!homestay || !canSendEmail(homestay.owner.email)) return;

    const to = resolveEmail(homestay.owner.email);
    if (!to) return; 

    if (type === "HOMESTAY_VERIFIED") {
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: "MITTI: Homestay verified",
        react: HomestayVerifiedEmail({
          name: homestay.owner.name,
          homestayName: homestay.name,
        }),
      });
    }

    if (type === "HOMESTAY_REJECTED") {
      await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject: "MITTI: Homestay verification rejected",
        react: HomestayRejectedEmail({
          name: homestay.owner.name,
          homestayName: homestay.name,
          reason: payload.reason ?? "",
        }),
      });
    }
  }
}
