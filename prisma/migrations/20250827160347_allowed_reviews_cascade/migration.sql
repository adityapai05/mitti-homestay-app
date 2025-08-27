-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_homestayId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "public"."Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
