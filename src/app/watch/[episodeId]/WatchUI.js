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
        className="w-full h-full object-cover"
        poster="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
        onClick={() => setIsPlaying(!isPlaying)}
        autoPlay={false}
      >
        <source src={videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} type="video/mp4" />
      </video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <button onClick={() => setIsPlaying(true)} className="bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) p-4 rounded-full transform transition-transform hover:scale-110">
            <Play fill="currentColor" size={32} className="ml-1" />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-(--color-gold-primary) transition-colors">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-(--color-gold-primary) transition-colors">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <div className="w-24 md:w-64 h-1.5 bg-white/20 rounded-full cursor-pointer relative">
            <div className="absolute top-0 left-0 h-full bg-(--color-gold-primary) rounded-full w-1/3"></div>
            <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 bg-white rounded-full shadow"></div>
          </div>
          <span className="text-white text-xs font-medium hidden sm:block">10:45 / 24:00</span>
        </div>
        <button className="text-white hover:text-(--color-gold-primary) transition-colors">
          <Maximize size={20} />
        </button>
      </div>
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