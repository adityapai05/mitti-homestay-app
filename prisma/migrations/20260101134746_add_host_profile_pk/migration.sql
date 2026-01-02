-- AlterTable
ALTER TABLE "public"."HostProfile" ADD CONSTRAINT "HostProfile_pkey" PRIMARY KEY ("userId");

-- DropIndex
DROP INDEX "public"."HostProfile_userId_key";
