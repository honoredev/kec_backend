-- CreateEnum
CREATE TYPE "AudioType" AS ENUM ('music', 'news', 'podcast');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "images" TEXT;

-- CreateTable
CREATE TABLE "live_matches" (
    "id" SERIAL NOT NULL,
    "team1" TEXT NOT NULL,
    "team2" TEXT NOT NULL,
    "score" TEXT,
    "time" TEXT,
    "stream_url" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "live_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audios" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "audio_url" TEXT NOT NULL,
    "duration" TEXT,
    "type" "AudioType" NOT NULL DEFAULT 'music',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audios_pkey" PRIMARY KEY ("id")
);
