-- AlterTable
ALTER TABLE "Stamp" ADD COLUMN     "liked" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_StampLiker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StampLiker_AB_unique" ON "_StampLiker"("A", "B");

-- CreateIndex
CREATE INDEX "_StampLiker_B_index" ON "_StampLiker"("B");

-- AddForeignKey
ALTER TABLE "_StampLiker" ADD CONSTRAINT "_StampLiker_A_fkey" FOREIGN KEY ("A") REFERENCES "Stamp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StampLiker" ADD CONSTRAINT "_StampLiker_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
