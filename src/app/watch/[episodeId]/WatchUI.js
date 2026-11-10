"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ChevronLeft, ChevronRight, Play, ChevronDown, Star } from "lucide-react";
import VideoPlayer from "./VideoPlayer";

export default function WatchUI({ 
  episodeId, 
  animeSlug, 
  currentEpNum, 
  formattedTitle, 
  episodes, 
  prevEpisode, 
  nextEpisode, 
  videoUrl, 
  seasonNumber, 
  availableSeasons,
  recommendedSeries 
}) {
  const router = useRouter();
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);

  return (
    <div className="flex flex-col w-full pb-12">
      
      <div className="flex items-center justify-between mb-4">
        <Link href={`/anime/${animeSlug}?season=${seasonNumber}`} className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Back to {formattedTitle}
        </Link>
        <h1 className="text-lg font-bold text-(--color-text-primary) hidden sm:block">{formattedTitle} - S{seasonNumber} E{currentEpNum}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          <VideoPlayer 
            videoUrl={videoUrl} 
            episodeId={episodeId} 
            onVideoEnded={() => {
              if (nextEpisode) {
                router.push(`/watch/${nextEpisode}?season=${seasonNumber}`);
              }
            }} 
          />

          <div className="flex flex-wrap items-center justify-between gap-4 bg-(--color-bg-card) border border-(--color-border-custom) p-4 rounded-xl">
            <div className="flex items-center gap-2">
              {prevEpisode ? (
                <Link href={`/watch/${prevEpisode}?season=${seasonNumber}`} className="flex items-center gap-1 bg-(--color-bg-secondary) hover:bg-(--color-border-custom) text-(--color-text-primary) px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <ChevronLeft size={16} /> Prev
                </Link>
              ) : (
                <button disabled className="flex items-center gap-1 bg-(--color-bg-secondary) opacity-50 cursor-not-allowed text-(--color-text-secondary) px-4 py-2 rounded-md text-sm font-medium">
                  <ChevronLeft size={16} /> Prev
                </button>
              )}

              {nextEpisode ? (
                <Link href={`/watch/${nextEpisode}?season=${seasonNumber}`} className="flex items-center gap-1 bg-(--color-bg-secondary) hover:bg-(--color-border-custom) text-(--color-text-primary) px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Next <ChevronRight size={16} />
                </Link>
              ) : (
                <button disabled className="flex items-center gap-1 bg-(--color-bg-secondary) opacity-50 cursor-not-allowed text-(--color-text-secondary) px-4 py-2 rounded-md text-sm font-medium">
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>

            <Link href={`/download/${episodeId}`} className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-6 rounded-md transition-colors">
              <Download size={18} /> Download Episode
            </Link>
          </div>

          <div className="bg-(--color-bg-card) border border-(--color-border-custom) p-5 rounded-xl">
            <h2 className="text-xl font-bold text-(--color-gold-primary) mb-2">{formattedTitle} - Season {seasonNumber} Episode {currentEpNum}</h2>
            <p className="text-sm text-(--color-text-secondary)">You are watching Episode {currentEpNum}. Make sure to add this anime to your watchlist to keep track of your progress.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-4 h-150 flex flex-col">
            
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-(--color-border-custom)">
              <h2 className="text-lg font-bold text-(--color-text-primary)">Episodes</h2>
              
              {availableSeasons.length > 1 && (
                <div className="relative">
                  <button 
                    onClick={() => setIsSeasonOpen(!isSeasonOpen)}
                    className="flex items-center gap-1 bg-(--color-bg-secondary) border border-(--color-border-custom) text-(--color-text-primary) text-xs rounded-md py-1 px-2 hover:border-(--color-gold-primary) transition-colors"
                  >
                    S{seasonNumber}
                    <ChevronDown size={14} />
                  </button>
                  
                  {isSeasonOpen && (
                    <div className="absolute top-full right-0 mt-1 w-24 bg-(--color-bg-card) border border-(--color-border-custom) rounded-lg shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
                      {availableSeasons.map((s) => (
                        <button
                          key={s}
                          onClick={() => { 
                            setIsSeasonOpen(false); 
                            router.push(`/watch/${animeSlug}-episode-1?season=${s}`);
                          }}
                          className={`block w-full text-left px-3 py-1.5 text-xs transition-colors ${seasonNumber === s ? "text-(--color-gold-primary) bg-(--color-bg-secondary)" : "text-(--color-text-primary) hover:bg-(--color-bg-secondary)"}`}
                        >
                          Season {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
              {episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEpNum;
                return (
                  <Link key={ep.id} href={`/watch/${animeSlug}-episode-${ep.episodeNumber}?season=${ep.seasonNumber}`} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isActive ? "bg-gold-primary/10 border-(--color-gold-primary)" : "bg-(--color-bg-secondary) border-(--color-border-custom) hover:border-(--color-gold-primary)"}`}>
                    <div className={`p-2 rounded-full ${isActive ? "bg-(--color-gold-primary) text-(--color-bg-main)" : "bg-(--color-bg-card) text-(--color-text-secondary)"}`}>
                      <Play size={14} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${isActive ? "text-(--color-gold-primary)" : "text-(--color-text-primary)"}`}>Episode {ep.episodeNumber}</span>
                      <span className="text-xs text-(--color-text-secondary) truncate w-40">{ep.title || "Subbed"}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {recommendedSeries && recommendedSeries.length > 0 && (
        <div className="mt-12 pt-8 border-t border-(--color-border-custom)">
          <h2 className="text-2xl font-bold text-(--color-text-primary) mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-(--color-gold-primary) rounded-full inline-block"></span>
            Recommended Series
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendedSeries.map((anime) => (
              <Link key={anime.id} href={`/anime/${anime.slug}`} className="group relative flex flex-col bg-(--color-bg-card) rounded-lg overflow-hidden border border-(--color-border-custom) hover:border-(--color-gold-primary) transition-all duration-300">
                
                <div className="relative aspect-2/3 overflow-hidden block bg-(--color-bg-secondary)">
                  {anime.posterUrl ? (
                     <img src={anime.posterUrl} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-(--color-text-secondary) text-sm">No Image</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="bg-(--color-gold-primary) text-(--color-bg-main) p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300">
                      <Play fill="currentColor" size={24} />
                    </div>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-1 z-20 bg-(--color-bg-card)">
                  <span className="text-sm font-semibold text-(--color-text-primary) group-hover:text-(--color-gold-primary) truncate transition-colors">
                    {anime.title}
                  </span>
                  <div className="flex items-center justify-between text-xs text-(--color-text-secondary)">
                    <span>{anime.type || "TV"} • {anime.totalEpisodes || "?"} eps</span>
                    <span className="flex items-center gap-1 text-(--color-gold-primary)">
                      <Star size={12} fill="currentColor" />
                      {anime.score || "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}