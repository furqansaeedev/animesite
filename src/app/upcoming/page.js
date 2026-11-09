import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimeCard from "../anime/AnimeCard";
import { Calendar } from "lucide-react";

export default async function UpcomingPage() {
  const animeList = await prisma.anime.findMany({
    where: { status: "Upcoming" },
    orderBy: { releaseYear: "asc" },
  });

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
          <span className="w-2 h-8 bg-(--color-gold-primary) rounded-full inline-block"></span>
          Upcoming Anime
        </h1>
        <p className="text-(--color-text-secondary) mt-2">
          Highly anticipated anime that are yet to be released.
        </p>
      </div>

      {animeList.length === 0 ? (
        <div className="text-(--color-text-secondary) p-8 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
          No upcoming anime found.
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