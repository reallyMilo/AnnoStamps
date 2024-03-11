/*
  Warnings:

  - Made the column `changedAt` on table `Stamp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stamp" ALTER COLUMN "changedAt" SET NOT NULL,
ALTER COLUMN "changedAt" SET DEFAULT CURRENT_TIMESTAMP;
