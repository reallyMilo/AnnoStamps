-- AlterTable
ALTER TABLE "Stamp" ADD COLUMN     "capital" TEXT,
ADD COLUMN     "good" TEXT,
ADD COLUMN     "goodType" TEXT,
ADD COLUMN     "population" TEXT,
ADD COLUMN     "townhall" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tradeUnion" BOOLEAN NOT NULL DEFAULT false;
