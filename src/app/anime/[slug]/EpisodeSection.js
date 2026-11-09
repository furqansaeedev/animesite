"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";

export default function EpisodeSection({ animeSlug, episodes }) {
  // Group episodes by season
  const seasons = [...new Set(episodes.map((ep) => ep.seasonNumber || 1))].sort((a, b) => a - b);
  
  // Default to the latest season
  const [selectedSeason, setSelectedSeason] = useState(seasons.length > 0 ? seasons[seasons.length - 1] : 1);
  const [isOpen, setIsOpen] = useState(false);

  // Filter episodes for the selected season
  const currentEpisodes = episodes.filter((ep) => (ep.seasonNumber || 1) === selectedSeason);

  if (episodes.length === 0) {
    return <p className="text-sm text-(--color-text-secondary)">No episodes added yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Season Dropdown */}
      {seasons.length > 1 && (
        <div className="relative inline-block w-48">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-(--color-bg-card) border border-(--color-border-custom) text-(--color-text-primary) text-sm rounded-lg py-2 px-4 hover:border-(--color-gold-primary) transition-colors"
          >
            <span>Season {selectedSeason}</span>
            <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-(--color-bg-card) border border-(--color-border-custom) rounded-lg shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
              {seasons.map((season) => (
                <button
                  key={season}
                  onClick={() => { setSelectedSeason(season); setIsOpen(false); }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedSeason === season ? "text-(--color-gold-primary) bg-(--color-bg-secondary)" : "text-(--color-text-primary) hover:bg-(--color-bg-secondary)"}`}
                >
                  Season {season}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Episode Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {currentEpisodes.map((episode) => (
          <Link key={episode.id} href={`/watch/${animeSlug}-episode-${episode.episodeNumber}?season=${episode.seasonNumber || 1}`} className="group flex items-center justify-between bg-(--color-bg-secondary) border border-(--color-border-custom) hover:border-(--color-gold-primary) rounded-md p-3 transition-colors">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-(--color-text-primary) group-hover:text-(--color-gold-primary) transition-colors">
                Episode {episode.episodeNumber}
              </span>
              <span className="text-xs text-(--color-text-secondary) truncate w-24 sm:w-32">
                {episode.title || "Subbed"}
              </span>
            </div>
            <div className="bg-(--color-bg-card) p-1.5 rounded-full group-hover:bg-(--color-gold-primary) transition-colors">
              <Play size={14} className="text-(--color-text-secondary) group-hover:text-(--color-bg-main)" fill="currentColor" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}