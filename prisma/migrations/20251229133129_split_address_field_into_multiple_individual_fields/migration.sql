/*
  Warnings:

  - You are about to drop the column `address` on the `Homestay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Homestay" DROP COLUMN "address",
ADD COLUMN     "district" TEXT,
ADD COLUMN     "flatno" TEXT,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "village" TEXT;
