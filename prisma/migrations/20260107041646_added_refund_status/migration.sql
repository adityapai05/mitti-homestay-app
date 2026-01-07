-- CreateEnum
CREATE TYPE "public"."RefundStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "refundProcessedAt" TIMESTAMP(3),
ADD COLUMN     "refundStatus" "public"."RefundStatus" NOT NULL DEFAULT 'NOT_APPLICABLE';
