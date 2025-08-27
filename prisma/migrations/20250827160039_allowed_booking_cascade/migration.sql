-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_homestayId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "public"."Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
