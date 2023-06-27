
-- AlterTable
ALTER TABLE "Stamp"
RENAME COLUMN "likes" TO "oldLikes";
ALTER TABLE "Stamp"
RENAME COLUMN "screenshot" TO "imageUrl";
ALTER TABLE "Stamp"
RENAME COLUMN "stamp" TO "stampFileUrl";
ALTER TABLE "Stamp" DROP COLUMN "liked";