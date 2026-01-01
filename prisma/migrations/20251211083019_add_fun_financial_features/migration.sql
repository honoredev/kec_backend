-- CreateEnum
CREATE TYPE "FunType" AS ENUM ('meme', 'funny', 'viral', 'joke');

-- CreateEnum
CREATE TYPE "FinancialType" AS ENUM ('charts', 'infographics', 'reports', 'analysis');

-- CreateTable
CREATE TABLE "fun_content" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "type" "FunType" NOT NULL DEFAULT 'meme',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT NOT NULL DEFAULT 'KEC Fun',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fun_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_data" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT NOT NULL,
    "category" "FinancialType" NOT NULL DEFAULT 'charts',
    "trend" TEXT,
    "is_positive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fun_content_slug_key" ON "fun_content"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "financial_data_slug_key" ON "financial_data"("slug");
