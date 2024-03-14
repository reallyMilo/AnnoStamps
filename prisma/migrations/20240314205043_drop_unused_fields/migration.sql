/*
  Warnings:

  - You are about to drop the column `goodCategory` on the `Stamp` table. All the data in the column will be lost.
  - You are about to drop the column `population` on the `Stamp` table. All the data in the column will be lost.
  - You are about to drop the column `townhall` on the `Stamp` table. All the data in the column will be lost.
  - You are about to drop the column `tradeUnion` on the `Stamp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stamp" DROP COLUMN "goodCategory",
DROP COLUMN "population",
DROP COLUMN "townhall",
DROP COLUMN "tradeUnion";
