"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw } from "lucide-react";

export default function AnimeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from current URL
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "recent");

  const handleApply = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (type) params.set("type", type);
    if (sort) params.set("sort", sort);
    
    router.push(`/anime?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setGenre("");
    setType("");
    setSort("recent");
    router.push("/anime");
  };

  return (
    <form onSubmit={handleApply} className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-4 md:p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-(--color-gold-primary)" />
        <h2 className="text-lg font-bold text-(--color-text-primary)">Filters & Search</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="relative">
          <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Search</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Anime title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-md py-2 pl-9 pr-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            />
            <Search className="absolute left-3 top-2.5 text-(--color-text-secondary)" size={16} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-md py-2 px-3 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors appearance-none"
          >
            <option value="">All Types</option>
            <option value="TV">TV Series</option>
            <option value="Movie">Movie</option>
            <option value="OVA">OVA</option>
            <option value="ONA">ONA</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Sort By</label>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-md py-2 px-3 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors appearance-none"
          >
            <option value="recent">Recently Added</option>
            <option value="popular">Highest Rated</option>
            <option value="az">A - Z</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
           <button type="submit" className="flex-1 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-4 rounded-md text-sm transition-colors">
             Apply
           </button>
           <button type="button" onClick={handleReset} className="p-2 bg-(--color-bg-secondary) border border-(--color-border-custom) hover:border-(--color-gold-primary) text-(--color-text-secondary) rounded-md transition-colors" title="Reset Filters">
             <RotateCcw size={18} />
           </button>
        </div>
      </div>
    </form>
  );
}