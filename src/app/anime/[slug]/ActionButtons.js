"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Heart, Check, Share2 } from "lucide-react";

export default function ActionButtons({ animeId, animeSlug, initialWatchlist, initialFavorite }) {
  const router = useRouter();
  const [isInWatchlist, setIsInWatchlist] = useState(initialWatchlist);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggle = async (type) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, type }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      
      if (type === "watchlist") setIsInWatchlist(data.added);
      if (type === "favorite") setIsFavorite(data.added);
      
    } catch (error) {
      console.error("Failed to update list");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    // Get the current URL and copy it to clipboard
    const url = `${window.location.origin}/anime/${animeSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      
      {/* Watchlist Button */}
      <button 
        onClick={() => handleToggle("watchlist")}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 font-medium py-2 px-6 h-12 rounded-full transition-colors disabled:opacity-50 ${
          isInWatchlist 
            ? "bg-(--color-gold-primary) text-(--color-bg-main) hover:bg-(--color-gold-hover)" 
            : "bg-(--color-bg-card) border border-(--color-border-custom) hover:bg-(--color-bg-secondary) text-(--color-text-primary)"
        }`}
      >
        {isInWatchlist ? <Check size={18} /> : <Plus size={18} />}
        {isInWatchlist ? "In Watchlist" : "Watchlist"}
      </button>

      {/* Favorite Button */}
      <button 
        onClick={() => handleToggle("favorite")}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 font-medium py-2 px-6 h-12 rounded-full transition-colors disabled:opacity-50 ${
          isFavorite 
            ? "bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20" 
            : "bg-(--color-bg-card) border border-(--color-border-custom) hover:bg-(--color-bg-secondary) text-(--color-text-primary)"
        }`}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        {isFavorite ? "Favorited" : "Favorite"}
      </button>

      {/* Share Button */}
      <button 
        onClick={handleShare}
        className="flex items-center justify-center w-12 h-12 bg-(--color-bg-card) border border-(--color-border-custom) text-(--color-text-primary) rounded-full hover:bg-(--color-bg-secondary) hover:border-(--color-gold-primary) transition-colors relative"
        title="Copy link to clipboard"
      >
        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
        
        {/* Tooltip for Copied state */}
        {copied && (
          <span className="absolute -top-10 bg-(--color-bg-card) text-(--color-text-primary) text-xs py-1 px-2 rounded border border-(--color-border-custom) whitespace-nowrap">
            Link Copied!
          </span>
        )}
      </button>

    </div>
  );
}