import type { BookingStatus } from "./types";

interface StatusMessage {
  badge: string;
  title: string;
  description: string;
}

export const STATUS_MESSAGES: Record<BookingStatus, StatusMessage> = {
  PENDING_HOST_APPROVAL: {
    badge: "Waiting for host approval",
    title: "Your booking request has been sent to the host.",
    description:
      "The host is reviewing your request. Your selected dates are temporarily reserved and no payment is required at this stage.",
  },

  AWAITING_PAYMENT: {
    badge: "Payment required",
    title: "The host has approved your booking.",
    description:
      "Please complete the payment to confirm your stay. Payment is required to finalize this booking.",
  },

  CONFIRMED: {
    badge: "Booking confirmed",
    title: "Your stay is confirmed.",
    description: "You can contact the host for any assistance before check-in.",
  },

  CANCELLED_BY_GUEST: {
    badge: "Cancelled",
    title: "You cancelled this booking.",
    description:
      "Any applicable refund will be processed based on the cancellation policy.",
  },

  CANCELLED_BY_HOST: {
    badge: "Cancelled by host",
    title: "The host cancelled this booking.",
    description:
      "You will be notified about the next steps regarding refunds or alternatives.",
  },

  COMPLETED: {
    badge: "Stay completed",
    title: "Your stay has been completed.",
    description:
      "We hope you had a great experience. You can leave a review to help other travellers.",
  },
};

export const STATUS_STYLES: Record<
  BookingStatus,
  { badge: string; text: string }
> = {
  PENDING_HOST_APPROVAL: {
    badge: "bg-mitti-khaki",
    text: "text-mitti-dark-brown",
  },
  AWAITING_PAYMENT: {
    badge: "bg-mitti-cream",
    text: "text-mitti-brown",
  },
  CONFIRMED: {
    badge: "bg-mitti-olive",
    text: "text-white",
  },
  CANCELLED_BY_GUEST: {
    badge: "bg-mitti-error/15",
    text: "text-mitti-error",
  },
  CANCELLED_BY_HOST: {
    badge: "bg-mitti-error/15",
    text: "text-mitti-error",
  },
  COMPLETED: {
    badge: "bg-mitti-beige",
    text: "text-mitti-dark-brown",
  },
};
