import { prisma } from "@/lib/prisma";
import FeaturedSlider from "./FeaturedSlider";
import AnimeCard from "./anime/AnimeCard";
import Link from "next/link";

export default async function Home() {
  // Fetch real data from the database
  const allAnime = await prisma.anime.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Use the first 3 for the featured slider
  const featuredAnime = allAnime.slice(0, 3);

  // Use the first 6 for the recently updated grid
  const recentlyUpdated = allAnime.slice(0, 6);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Featured Slider */}
      <section>
        {featuredAnime.length > 0 ? (
          <FeaturedSlider featuredAnime={featuredAnime} />
        ) : (
          <div className="w-full h-100 rounded-xl bg-(--color-bg-secondary) flex flex-col items-center justify-center border border-(--color-border-custom)">
            <h2 className="text-2xl font-bold text-(--color-text-primary) mb-2">Welcome to AIME</h2>
            <p className="text-(--color-text-secondary) mb-4">Add some anime in the Admin Panel.</p>
            <Link href="/admin/anime/new" className="bg-(--color-gold-primary) text-(--color-bg-main) px-6 py-2 rounded-full font-bold">Add Anime</Link>
          </div>
        )}
      </section>

      {/* Recently Updated Section */}
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
        
        {/* Anime Grid */}
        {recentlyUpdated.length === 0 ? (
          <div className="text-(--color-text-secondary) p-8 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
            No anime found. Add some in the Admin Panel!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recentlyUpdated.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}