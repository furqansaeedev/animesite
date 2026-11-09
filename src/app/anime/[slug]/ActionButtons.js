"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Heart, Check } from "lucide-react";

export default function ActionButtons({ animeId, initialWatchlist, initialFavorite }) {
  const router = useRouter();
  const [isInWatchlist, setIsInWatchlist] = useState(initialWatchlist);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (type) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, type }),
      });

      if (res.status === 401) {
        // If not logged in, redirect to login
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

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
      
      {/* Watchlist Button */}
      <button 
        onClick={() => handleToggle("watchlist")}
        disabled={isLoading}
        className={`flex items-center gap-2 font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 ${
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
        className={`flex items-center gap-2 font-medium py-2 px-4 rounded-full transition-colors disabled:opacity-50 ${
          isFavorite 
            ? "bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20" 
            : "bg-(--color-bg-card) border border-(--color-border-custom) hover:bg-(--color-bg-secondary) text-(--color-text-primary)"
        }`}
      >
        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        {isFavorite ? "Favorited" : "Favorite"}
      </button>

    </div>
  );
}