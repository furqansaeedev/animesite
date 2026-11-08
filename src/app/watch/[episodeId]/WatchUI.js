"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

function VideoPlayer({ videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group border border-(--color-border-custom)">
      <video
        className="w-full h-full object-contain"
        controls // <-- This fixes the play button and controls natively!
        onClick={() => setIsPlaying(!isPlaying)}
        muted={isMuted}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function WatchUI({ episodeId, animeSlug, currentEpNum, formattedTitle, episodes, prevEpisode, nextEpisode, videoUrl }) {
  return (
    <div className="flex flex-col w-full pb-12">
      <div className="flex items-center justify-between mb-4">
        <Link href={`/anime/${animeSlug}`} className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Back to {formattedTitle}
        </Link>
        <h1 className="text-lg font-bold text-(--color-text-primary) hidden sm:block">{formattedTitle} - Episode {currentEpNum}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Real Video Player */}
          <VideoPlayer videoUrl={videoUrl} />

          <div className="flex flex-wrap items-center justify-between gap-4 bg-(--color-bg-card) border border-(--color-border-custom) p-4 rounded-xl">
            <div className="flex items-center gap-2">
              {prevEpisode ? (
                <Link href={`/watch/${prevEpisode}`} className="flex items-center gap-1 bg-(--color-bg-secondary) hover:bg-(--color-border-custom) text-(--color-text-primary) px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <ChevronLeft size={16} /> Prev
                </Link>
              ) : (
                <button disabled className="flex items-center gap-1 bg-(--color-bg-secondary) opacity-50 cursor-not-allowed text-(--color-text-secondary) px-4 py-2 rounded-md text-sm font-medium">
                  <ChevronLeft size={16} /> Prev
                </button>
              )}

              {nextEpisode ? (
                <Link href={`/watch/${nextEpisode}`} className="flex items-center gap-1 bg-(--color-bg-secondary) hover:bg-(--color-border-custom) text-(--color-text-primary) px-4 py-2 rounded-md text-sm font-medium transition-colors">
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

          <div className="bg-(--color-bg-card) border border-(--color-border-custom) p-5 rounded-xl mt-2">
            <h2 className="text-xl font-bold text-(--color-gold-primary) mb-2">{formattedTitle} - Episode {currentEpNum}</h2>
            <p className="text-sm text-(--color-text-secondary)">You are watching Episode {currentEpNum}. Make sure to add this anime to your watchlist to keep track of your progress.</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-4 h-150 flex flex-col">
            <h2 className="text-lg font-bold text-(--color-text-primary) mb-4 pb-2 border-b border-(--color-border-custom)">Episodes</h2>
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 custom-scrollbar">
              {episodes.map((ep) => {
                const isActive = ep.episodeNumber === currentEpNum;
                return (
                  <Link key={ep.id} href={`/watch/${animeSlug}-episode-${ep.episodeNumber}`} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isActive ? "bg-gold-primary/10 border-(--color-gold-primary)" : "bg-(--color-bg-secondary) border-(--color-border-custom) hover:border-(--color-gold-primary)"}`}>
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
    </div>
  );
}