import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Tags } from "lucide-react";

export default async function GenresPage() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
          <span className="w-2 h-8 bg-(--color-gold-primary) rounded-full inline-block"></span>
          Browse by Genre
        </h1>
        <p className="text-(--color-text-secondary) mt-2">
          Find your next favorite anime based on its genre.
        </p>
      </div>

      {genres.length === 0 ? (
        <div className="text-(--color-text-secondary) p-8 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
          No genres found in the database. Add some in the Admin Panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <Link 
              key={genre.id} 
              href={`/anime?genre=${genre.name}`} 
              className="bg-(--color-bg-card) border border-(--color-border-custom) hover:border-(--color-gold-primary) rounded-xl p-6 flex items-center justify-center text-center transition-colors group"
            >
              <span className="text-lg font-bold text-(--color-text-primary) group-hover:text-(--color-gold-primary) transition-colors">
                {genre.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}