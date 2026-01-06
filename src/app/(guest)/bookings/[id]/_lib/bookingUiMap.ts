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
    showCancel: false,
    showPayment: false,
    showReview: false,
    showHostInfo: false,
    showCheckInInfo: false,
  },

  AWAITING_PAYMENT: {
    showCancel: false,
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

  CANCELLED_BY_GUEST: {
    showCancel: false,
    showPayment: false,
    showReview: false,
    showHostInfo: false,
    showCheckInInfo: false,
  },

  CANCELLED_BY_HOST: {
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
