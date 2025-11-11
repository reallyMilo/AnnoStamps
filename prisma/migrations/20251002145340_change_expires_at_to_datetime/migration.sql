/*
  Warnings:

  - The `expires_at` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "expires_at",
ADD COLUMN     "expires_at" TIMESTAMP(3);
