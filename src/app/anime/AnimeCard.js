import Link from "next/link";
import { Play, Star } from "lucide-react";

export default function AnimeCard({ anime }) {
  return (
    <div className="group relative flex flex-col bg-(--color-bg-card) rounded-lg overflow-hidden border border-(--color-border-custom) hover:border-(--color-gold-primary) transition-all duration-300">
      
      {/* Poster Image Area */}
      <Link href={`/anime/${anime.slug}`} className="relative aspect-2/3 overflow-hidden block bg-(--color-bg-secondary)">
        {anime.posterUrl ? (
           // Use standard img tag to support any external URL without Next.js domain configuration
           <img 
             src={anime.posterUrl} 
             alt={anime.title}
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             loading="lazy"
           />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-(--color-text-secondary) text-sm">No Image</span>
          </div>
        )}
        
        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="bg-(--color-gold-primary) text-(--color-bg-main) p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300">
            <Play fill="currentColor" size={24} />
          </div>
        </div>
      </Link>

      {/* Info Area */}
      <div className="p-3 flex flex-col gap-1 z-20 bg-(--color-bg-card)">
        <Link href={`/anime/${anime.slug}`} className="text-sm font-semibold text-(--color-text-primary) hover:text-(--color-gold-primary) truncate transition-colors">
          {anime.title}
        </Link>
        
        <div className="flex items-center justify-between text-xs text-(--color-text-secondary)">
          <span>{anime.type || "TV"} • {anime.totalEpisodes || "?"} eps</span>
          <span className="flex items-center gap-1 text-(--color-gold-primary)">
            <Star size={12} fill="currentColor" />
            {anime.score || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}