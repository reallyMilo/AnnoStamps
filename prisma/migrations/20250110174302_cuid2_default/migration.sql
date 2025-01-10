-- AlterTable
ALTER TABLE "_StampLiker" ADD CONSTRAINT "_StampLiker_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_StampLiker_AB_unique";
