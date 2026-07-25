-- CreateTable
CREATE TABLE "outfit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occasion" TEXT,
    "notes" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_item" (
    "id" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "clothingItemId" TEXT NOT NULL,

    CONSTRAINT "outfit_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outfitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outfit_userId_idx" ON "outfit"("userId");

-- CreateIndex
CREATE INDEX "outfit_item_outfitId_idx" ON "outfit_item"("outfitId");

-- CreateIndex
CREATE INDEX "outfit_item_clothingItemId_idx" ON "outfit_item"("clothingItemId");

-- CreateIndex
CREATE UNIQUE INDEX "outfit_item_outfitId_clothingItemId_key" ON "outfit_item"("outfitId", "clothingItemId");

-- CreateIndex
CREATE INDEX "outfit_log_userId_idx" ON "outfit_log"("userId");

-- CreateIndex
CREATE INDEX "outfit_log_outfitId_idx" ON "outfit_log"("outfitId");

-- CreateIndex
CREATE INDEX "outfit_log_date_idx" ON "outfit_log"("date");

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_item" ADD CONSTRAINT "outfit_item_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_item" ADD CONSTRAINT "outfit_item_clothingItemId_fkey" FOREIGN KEY ("clothingItemId") REFERENCES "clothing_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_log" ADD CONSTRAINT "outfit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_log" ADD CONSTRAINT "outfit_log_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
