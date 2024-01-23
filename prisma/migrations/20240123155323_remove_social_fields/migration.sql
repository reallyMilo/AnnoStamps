/*
  Warnings:

  - You are about to drop the column `discord` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailContact` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reddit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitch` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "discord",
DROP COLUMN "emailContact",
DROP COLUMN "reddit",
DROP COLUMN "twitch",
DROP COLUMN "twitter";
