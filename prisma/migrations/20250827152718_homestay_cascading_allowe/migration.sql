-- DropForeignKey
ALTER TABLE "public"."Homestay" DROP CONSTRAINT "Homestay_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Homestay" ADD CONSTRAINT "Homestay_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
