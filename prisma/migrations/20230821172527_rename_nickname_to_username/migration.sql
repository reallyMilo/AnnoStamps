/*
  Warnings:

  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nicknameURL` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[usernameURL]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/

-- AlterTable
ALTER TABLE "User" RENAME COLUMN "nickname" to "username";
ALTER TABLE "User" RENAME COLUMN "nicknameURL" to "usernameURL";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_usernameURL_key" ON "User"("usernameURL");

-- DropIndex
DROP INDEX "User_nicknameURL_key";

-- DropIndex
DROP INDEX "User_nickname_key";
