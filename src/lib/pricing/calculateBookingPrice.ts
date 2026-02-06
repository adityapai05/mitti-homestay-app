export interface BookingPriceInput {
  pricePerNight: number; 
  nights: number;
  guests: number;
  includeGuide?: boolean;
  guideFeePerNight?: number; 
}

export interface BookingPriceBreakdown {
  nights: number;

  stayBase: number;
  guideFee: number;
  platformFee: number;
  gst: number;

  subtotal: number;
  total: number;
}

export interface BookingPriceResult {
  breakdown: BookingPriceBreakdown;
  total: number;
}

const GST_RATE = 0.18;
const PLATFORM_FEE_RATE = 0.05;

function toPaise(amount: number): number {
  return Math.round(amount * 100);
}

function toRupees(amount: number): number {
  return Math.round(amount) / 100;
}

export function calculateBookingPrice(
  input: BookingPriceInput,
): BookingPriceResult {
  const {
    pricePerNight,
    nights,
    includeGuide = false,
    guideFeePerNight = 0,
  } = input;

  if (nights < 1) {
    throw new Error("INVALID_NIGHTS");
  }

  if (pricePerNight <= 0) {
    throw new Error("INVALID_PRICE");
  }

  const stayBasePaise = toPaise(pricePerNight) * nights;

  const guideFeePaise =
    includeGuide && guideFeePerNight > 0
      ? toPaise(guideFeePerNight) * nights
      : 0;

  const platformFeePaise = Math.round(stayBasePaise * PLATFORM_FEE_RATE);

  const taxableAmountPaise = stayBasePaise + guideFeePaise + platformFeePaise;

  const gstPaise = Math.round(taxableAmountPaise * GST_RATE);

  const totalPaise =
    stayBasePaise + guideFeePaise + platformFeePaise + gstPaise;

  const breakdown: BookingPriceBreakdown = {
    nights,

    stayBase: toRupees(stayBasePaise),
    guideFee: toRupees(guideFeePaise),
    platformFee: toRupees(platformFeePaise),
    gst: toRupees(gstPaise),

    subtotal: toRupees(taxableAmountPaise),
    total: toRupees(totalPaise),
  };

  return {
    breakdown,
    total: breakdown.total,
  };
}
