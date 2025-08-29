-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('ROOM', 'HOME');

-- AlterTable
ALTER TABLE "public"."Homestay" ADD COLUMN     "type" "public"."Type" NOT NULL DEFAULT 'ROOM';
