import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Play, Star, Calendar, Clock, Film, CheckCircle } from "lucide-react";
import ActionButtons from "./ActionButtons";

export default async function AnimeDetails({ params }) {
  const { slug } = await params;

  // Get the current user
  const session = await getSession();

  // Fetch anime with its episodes, genres, and studio
  const anime = await prisma.anime.findUnique({
    where: { slug },
    include: {
      episodes: { orderBy: { episodeNumber: "asc" } },
      genres: { include: { genre: true } },
      studio: true,
    }
  });

  if (!anime) notFound();

  // Check if the user has this in their watchlist/favorites
  let isInWatchlist = false;
  let isFavorite = false;

  if (session) {
    const watchlistEntry = await prisma.watchlist.findUnique({
      where: { userId_animeId: { userId: session.user.id, animeId: anime.id } }
    });
    const favoriteEntry = await prisma.favorite.findUnique({
      where: { userId_animeId: { userId: session.user.id, animeId: anime.id } }
    });
    
    isInWatchlist = !!watchlistEntry;
    isFavorite = !!favoriteEntry;
  }

  return (
    <div className="flex flex-col w-full pb-12">
      
      {/* Banner Area */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-(--color-border-custom) -mb-16 md:-mb-24 z-0">
        <div className="absolute inset-0 bg-linear-to-t from-(--color-bg-main) via-bg-main/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-(--color-bg-secondary) flex items-center justify-center">
          {anime.bannerUrl ? (
            <img src={anime.bannerUrl} alt={anime.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-(--color-border-custom)">No Banner Image</span>
          )}
        </div>
      </div>

      <div className="relative z-20 px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto w-full">
        {/* Poster */}
        <div className="w-40 md:w-56 shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden border-2 border-(--color-border-custom) shadow-2xl bg-(--color-bg-card) aspect-2/3">
           {anime.posterUrl ? (
             <img src={anime.posterUrl} alt={anime.title} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-(--color-text-secondary) text-sm">Poster Image</div>
           )}
        </div>

        {/* Details Info */}
        <div className="flex-1 flex flex-col pt-2 md:pt-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-(--color-text-primary) text-center md:text-left mb-2">
            {anime.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-(--color-gold-primary) bg-gold-primary/10 px-2 py-1 rounded">
              <Star size={14} fill="currentColor" /> {anime.score || "N/A"}
            </span>
            <span className="bg-(--color-bg-card) text-(--color-text-primary) px-2 py-1 rounded border border-(--color-border-custom)">{anime.type || "TV"}</span>
            <span className="bg-(--color-bg-card) text-(--color-text-primary) px-2 py-1 rounded border border-(--color-border-custom)">{anime.quality || "HD"}</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary)"><Calendar size={14} /> {anime.releaseYear || "N/A"}</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary)"><Clock size={14} /> {anime.duration || "24 min"}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
            {anime.genres.map((g) => (
              <Link key={g.genre.id} href={`/genre/${g.genre.name.toLowerCase()}`} className="text-xs text-(--color-text-secondary) hover:text-(--color-gold-primary) border border-(--color-border-custom) hover:border-(--color-gold-primary) px-3 py-1 rounded-full transition-colors">
                {g.genre.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mb-6">
            
            {/* Watch Now Button */}
            <Link href={`/watch/${anime.slug}-episode-1`} className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold h-12 px-8 rounded-full transition-colors w-full sm:w-auto justify-center">
              <Play fill="currentColor" size={18} /> Watch Now
            </Link>
            
            {/* Watchlist, Favorite, and Share Buttons */}
            <ActionButtons 
              animeId={anime.id} 
              animeSlug={anime.slug}
              initialWatchlist={isInWatchlist} 
              initialFavorite={isFavorite} 
            />
            
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-(--color-text-primary) mb-3 border-b border-(--color-border-custom) pb-2">Synopsis</h2>
          <p className="text-(--color-text-secondary) text-sm leading-relaxed mb-8">
            {anime.synopsis || "No synopsis available for this anime."}
          </p>
          
          <h2 className="text-xl font-bold text-(--color-text-primary) mb-3 border-b border-(--color-border-custom) pb-2">Episodes</h2>
          {anime.episodes.length === 0 ? (
             <p className="text-sm text-(--color-text-secondary)">No episodes added yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {anime.episodes.map((episode) => (
                <Link key={episode.id} href={`/watch/${anime.slug}-episode-${episode.episodeNumber}`} className="group flex items-center justify-between bg-(--color-bg-secondary) border border-(--color-border-custom) hover:border-(--color-gold-primary) rounded-md p-3 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-(--color-text-primary) group-hover:text-(--color-gold-primary) transition-colors">Episode {episode.episodeNumber}</span>
                    <span className="text-xs text-(--color-text-secondary) truncate w-24 sm:w-32">{episode.title || "Subbed"}</span>
                  </div>
                  <div className="bg-(--color-bg-card) p-1.5 rounded-full group-hover:bg-(--color-gold-primary) transition-colors">
                    <Play size={14} className="text-(--color-text-secondary) group-hover:text-(--color-bg-main)" fill="currentColor" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-5 h-fit">
          <h3 className="text-lg font-bold text-(--color-gold-primary) mb-4">Information</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Status</span>
              <span className="text-(--color-text-primary) font-medium flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> {anime.status || "Unknown"}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Studio</span>
              <span className="text-(--color-text-primary) font-medium">{anime.studio?.name || "Unknown"}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Type</span>
              <span className="text-(--color-text-primary) font-medium flex items-center gap-1"><Film size={14}/> {anime.type || "TV"}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Release Year</span>
              <span className="text-(--color-text-primary) font-medium">{anime.releaseYear || "Unknown"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}