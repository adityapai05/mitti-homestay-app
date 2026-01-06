import { CancellationPolicy } from "@prisma/client";

export function calculateRefund({
  policy,
  totalPrice,
  daysBeforeCheckIn,
}: {
  policy: CancellationPolicy;
  totalPrice: number;
  daysBeforeCheckIn: number;
}): number {
  switch (policy) {
    case "FLEXIBLE":
      return daysBeforeCheckIn >= 7 ? totalPrice : 0;

    case "MODERATE":
      if (daysBeforeCheckIn >= 14) return totalPrice;
      if (daysBeforeCheckIn >= 7) return totalPrice * 0.5;
      return 0;

    case "STRICT":
      return daysBeforeCheckIn >= 30 ? totalPrice * 0.5 : 0;

    default:
      return 0;
  }
}
