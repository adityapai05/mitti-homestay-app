/*
  Warnings:

  - Added the required column `accountHolderName` to the `HostPayoutAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."HostPayoutAccount" ADD COLUMN     "accountHolderName" TEXT NOT NULL;
