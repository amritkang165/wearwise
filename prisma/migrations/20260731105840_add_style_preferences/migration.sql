-- CreateTable
CREATE TABLE "style_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "colors" TEXT[],
    "brands" TEXT[],
    "fit" TEXT,
    "formality" TEXT,
    "style" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "style_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "style_preferences_userId_idx" ON "style_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "style_preferences_userId_key" ON "style_preferences"("userId");

-- AddForeignKey
ALTER TABLE "style_preferences" ADD CONSTRAINT "style_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
