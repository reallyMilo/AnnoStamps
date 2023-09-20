-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "smallUrl" TEXT,
    "mediumUrl" TEXT,
    "largeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stampId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_originalUrl_key" ON "Image"("originalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Image_thumbnailUrl_key" ON "Image"("thumbnailUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Image_smallUrl_key" ON "Image"("smallUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Image_mediumUrl_key" ON "Image"("mediumUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Image_largeUrl_key" ON "Image"("largeUrl");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_stampId_fkey" FOREIGN KEY ("stampId") REFERENCES "Stamp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
