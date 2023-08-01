/*
  Warnings:

  - A unique constraint covering the columns `[nicknameURL]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nicknameURL" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_nicknameURL_key" ON "User"("nicknameURL");
