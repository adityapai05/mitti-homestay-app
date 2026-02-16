import { prisma } from "@/lib/prisma";
import { calculateBookingPrice } from "@/lib/pricing/calculateBookingPrice";
import { Prisma } from "@prisma/client";

type ServerCalculateBookingPriceInput = {
  homestayId: string;
  checkIn: string | Date;
  checkOut: string | Date;
  guests: number;
  includeGuide?: boolean;
  prismaClient?: Prisma.TransactionClient;
};

export async function serverCalculateBookingPrice({
  homestayId,
  checkIn,
  checkOut,
  guests,
  includeGuide = false,
  prismaClient,
}: ServerCalculateBookingPriceInput) {
  const db = prismaClient ?? prisma;
  const homestay = await db.homestay.findUnique({
    where: { id: homestayId },
    select: {
      pricePerNight: true,
      guideFee: true,
      guideAvailable: true,
    },
  });

  if (!homestay) {
    throw new Error("HOMESTAY_NOT_FOUND");
  }

  const checkInDate = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
  const checkOutDate =
    typeof checkOut === "string" ? new Date(checkOut) : checkOut;

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const pricing = calculateBookingPrice({
    pricePerNight: homestay.pricePerNight.toNumber(),
    nights,
    guests,
    includeGuide: includeGuide && homestay.guideAvailable,
    guideFeePerNight: homestay.guideFee ? homestay.guideFee.toNumber() : 0,
  });

  const { breakdown } = pricing;

  return {
    nights: breakdown.nights,
    stayBase: breakdown.stayBase,
    guideFee: breakdown.guideFee,
    platformFee: breakdown.platformFee,
    gst: breakdown.gst,
    subtotal: breakdown.subtotal,
    total: breakdown.total,
  };
}
