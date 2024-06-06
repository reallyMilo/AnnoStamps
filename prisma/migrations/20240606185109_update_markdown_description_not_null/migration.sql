/*
  Warnings:

  - Made the column `markdownDescription` on table `Stamp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stamp" ALTER COLUMN "markdownDescription" SET NOT NULL;
