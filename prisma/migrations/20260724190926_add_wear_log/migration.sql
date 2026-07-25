-- CreateTable
CREATE TABLE "wear_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clothingItemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wear_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wear_log_userId_idx" ON "wear_log"("userId");

-- CreateIndex
CREATE INDEX "wear_log_clothingItemId_idx" ON "wear_log"("clothingItemId");

-- CreateIndex
CREATE INDEX "wear_log_date_idx" ON "wear_log"("date");

-- AddForeignKey
ALTER TABLE "wear_log" ADD CONSTRAINT "wear_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wear_log" ADD CONSTRAINT "wear_log_clothingItemId_fkey" FOREIGN KEY ("clothingItemId") REFERENCES "clothing_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
