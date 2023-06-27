/*
  Warnings:

  - You are about to drop the column `goodType` on the `Stamp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stamp"
RENAME COLUMN "goodType" TO "goodCategory";
