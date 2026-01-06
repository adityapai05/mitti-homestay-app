/*
  Warnings:

  - Added the required column `cancelledBy` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CancellationActor" AS ENUM ('GUEST', 'HOST', 'SYSTEM');

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "cancelledBy" "public"."CancellationActor" NOT NULL;
