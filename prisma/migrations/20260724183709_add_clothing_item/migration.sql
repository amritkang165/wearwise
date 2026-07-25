-- CreateTable
CREATE TABLE "clothing_item" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "brand" TEXT,
    "colors" TEXT[],
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "size" TEXT,
    "seasons" TEXT[],
    "occasions" TEXT[],
    "notes" TEXT,
    "images" TEXT[],
    "wearCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clothing_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clothing_item_userId_idx" ON "clothing_item"("userId");

-- AddForeignKey
ALTER TABLE "clothing_item" ADD CONSTRAINT "clothing_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
