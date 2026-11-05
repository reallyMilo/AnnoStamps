-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accessTokenExpiresAt" TIMESTAMPTZ(3),
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMPTZ(3);
