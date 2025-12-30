import type { BookingStatus } from "../_components/types";

interface BookingUiPermissions {
  showCancel: boolean;
  showPayment: boolean;
  showReview: boolean;

  showHostInfo: boolean;
  showCheckInInfo: boolean;
}

export const BOOKING_UI_MAP: Record<BookingStatus, BookingUiPermissions> = {
  PENDING_HOST_APPROVAL: {
    showCancel: true,
    showPayment: false,
    showReview: false,

    showHostInfo: false,
    showCheckInInfo: false,
  },

  AWAITING_PAYMENT: {
    showCancel: true,
    showPayment: true,
    showReview: false,

    showHostInfo: false,
    showCheckInInfo: false,
  },

  CONFIRMED: {
    showCancel: true,
    showPayment: false,
    showReview: false,

    showHostInfo: true,
    showCheckInInfo: true,
  },

  CANCELLED: {
    showCancel: false,
    showPayment: false,
    showReview: false,

    showHostInfo: false,
    showCheckInInfo: false,
  },

  COMPLETED: {
    showCancel: false,
    showPayment: false,
    showReview: true,

    showHostInfo: false,
    showCheckInInfo: false,
  },
};
