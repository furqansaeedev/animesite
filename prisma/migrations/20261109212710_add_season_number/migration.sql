/*
  Warnings:

  - A unique constraint covering the columns `[animeId,seasonNumber,episodeNumber]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Episode_animeId_episodeNumber_key";

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "seasonNumber" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Episode_animeId_seasonNumber_episodeNumber_key" ON "Episode"("animeId", "seasonNumber", "episodeNumber");
