/*
  Warnings:

  - The values [CANCELLED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CancellationPolicy" AS ENUM ('FLEXIBLE', 'MODERATE', 'STRICT');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."BookingStatus_new" AS ENUM ('PENDING_HOST_APPROVAL', 'AWAITING_PAYMENT', 'CONFIRMED', 'CANCELLED_BY_GUEST', 'CANCELLED_BY_HOST', 'COMPLETED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Booking" ALTER COLUMN "status" TYPE "public"."BookingStatus_new" USING ("status"::text::"public"."BookingStatus_new");
ALTER TYPE "public"."BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "public"."BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "public"."Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING_HOST_APPROVAL';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "refundAmount" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."Homestay" ADD COLUMN     "cancellationPolicy" "public"."CancellationPolicy" NOT NULL DEFAULT 'MODERATE';
