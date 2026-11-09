import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimeCard from "../anime/AnimeCard";
import { Clock } from "lucide-react";

export default async function OngoingPage() {
  const animeList = await prisma.anime.findMany({
    where: { status: "Ongoing" },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
          <span className="w-2 h-8 bg-(--color-gold-primary) rounded-full inline-block"></span>
          Ongoing Anime
        </h1>
        <p className="text-(--color-text-secondary) mt-2">
          Anime that are currently airing new episodes.
        </p>
      </div>

      {animeList.length === 0 ? (
        <div className="text-(--color-text-secondary) p-8 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
          No ongoing anime found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}