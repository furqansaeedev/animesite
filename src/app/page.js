import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimeCard from "./anime/AnimeCard";

export default async function Home() {
  // Fetch real anime from the database (Recently Updated)
  const recentAnime = await prisma.anime.findMany({
    take: 12,
    orderBy: { updatedAt: "desc" }, // Sort by most recently updated
  });

  // Fetch featured anime (if you marked any as featured in the database)
  const featuredAnime = await prisma.anime.findMany({
    where: { featured: true },
    take: 5,
  });

  // If no featured anime exist, just use the first 3 recent anime for the slider
  const displayFeatured = featuredAnime.length > 0 ? featuredAnime : recentAnime.slice(0, 3);

  return (
    <div className="flex flex-col gap-12 pb-12">
      
      {/* Featured Slider / Banner */}
      <section>
        {displayFeatured.length > 0 ? (
          <div className="relative w-full h-100 md:h-125 rounded-xl overflow-hidden border border-(--color-border-custom) flex items-end p-8 bg-(--color-bg-secondary)">
            {/* Background Image (You can add real banner images later) */}
            <div className="absolute inset-0 bg-linear-to-t from-(--color-bg-main) via-bg-main/80 to-transparent z-10" />
            
            <div className="relative z-20 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text-primary) mb-4">
                {displayFeatured[0].title}
              </h1>
              <p className="text-(--color-text-secondary) line-clamp-3 mb-6">
                {displayFeatured[0].synopsis || "No description available."}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/watch/${displayFeatured[0].slug}-episode-1`} className="bg-(--color-gold-primary) text-(--color-bg-main) px-8 py-3 rounded-full font-bold hover:bg-(--color-gold-hover) transition-colors">
                  Watch Now
                </Link>
                <Link href={`/anime/${displayFeatured[0].slug}`} className="bg-black/50 text-white border border-(--color-border-custom) px-8 py-3 rounded-full font-bold hover:bg-black/80 transition-colors">
                  Details
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-100 rounded-xl bg-(--color-bg-secondary) flex flex-col items-center justify-center border border-(--color-border-custom)">
             <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">Welcome to AIME</h2>
             <p className="text-(--color-text-secondary) mb-4">Your database is currently empty.</p>
             <Link href="/admin/anime/new" className="bg-(--color-gold-primary) text-(--color-bg-main) px-6 py-2 rounded-full font-bold">Add Anime in Admin Panel</Link>
          </div>
        )}
      </section>

      {/* Recently Updated Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-(--color-text-primary) flex items-center gap-2">
            <span className="w-1.5 h-6 bg-(--color-gold-primary) rounded-full inline-block"></span>
            Recently Updated
          </h2>
          <Link href="/anime" className="text-sm font-medium text-(--color-gold-primary) hover:text-(--color-gold-hover) transition-colors">
            View All
          </Link>
        </div>
        
        {recentAnime.length === 0 ? (
          <div className="text-(--color-text-secondary) p-8 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
            No anime found. Add some in the Admin Panel!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}