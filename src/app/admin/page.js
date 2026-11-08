"use client";

import { useState, useEffect } from "react";
import { Film, ListVideo, Users, Heart } from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ anime: 0, episodes: 0, users: 0, favorites: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="text-(--color-gold-primary) animate-pulse">Loading Stats...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-(--color-text-primary) mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-6">
          <Film className="text-(--color-gold-primary) mb-4" size={28} />
          <h3 className="text-3xl font-bold text-(--color-text-primary)">{stats.anime}</h3>
          <p className="text-sm text-(--color-text-secondary)">Total Anime</p>
        </div>
        <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-6">
          <ListVideo className="text-(--color-gold-primary) mb-4" size={28} />
          <h3 className="text-3xl font-bold text-(--color-text-primary)">{stats.episodes}</h3>
          <p className="text-sm text-(--color-text-secondary)">Total Episodes</p>
        </div>
        <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-6">
          <Users className="text-(--color-gold-primary) mb-4" size={28} />
          <h3 className="text-3xl font-bold text-(--color-text-primary)">{stats.users}</h3>
          <p className="text-sm text-(--color-text-secondary)">Registered Users</p>
        </div>
        <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-6">
          <Heart className="text-(--color-gold-primary) mb-4" size={28} />
          <h3 className="text-3xl font-bold text-(--color-text-primary)">{stats.favorites}</h3>
          <p className="text-sm text-(--color-text-secondary)">Total Favorites</p>
        </div>
      </div>
    </div>
  );
}