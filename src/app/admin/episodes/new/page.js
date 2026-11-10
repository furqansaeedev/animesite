"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddEpisodePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [animeList, setAnimeList] = useState([]);
  
  const [formData, setFormData] = useState({
    animeId: "",
    seasonNumber: 1,
    episodeNumber: 1,
    title: "",
    videoUrl: "",
    // Download Links Updated
    dl720p: "",
    dl480p: "",
    dl360p: "",
    dl240p: "",
    // Sizes Updated
    size720p: "720 MB",
    size480p: "480 MB",
    size360p: "360 MB",
    size240p: "240 MB",
  });

  useEffect(() => {
    const fetchAnime = async () => {
      const res = await fetch("/api/admin/anime");
      if (res.ok) {
        const data = await res.json();
        setAnimeList(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, animeId: data[0].id }));
        }
      }
    };
    fetchAnime();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: (name === "episodeNumber" || name === "seasonNumber") ? Number(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create episode");
      }

      router.push("/admin/episodes");
      router.refresh();

    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/episodes" className="p-2 rounded-full bg-(--color-bg-secondary) text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Add New Episode</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {animeList.length === 0 ? (
        <div className="text-(--color-text-primary) bg-(--color-bg-secondary) p-6 rounded-xl">
          You must create an Anime first before adding episodes. <Link href="/admin/anime/new" className="text-(--color-gold-primary) underline">Create Anime here.</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Select Anime</label>
            <select 
              name="animeId" 
              value={formData.animeId} 
              onChange={handleChange}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
              required
            >
              {animeList.map(anime => (
                <option key={anime.id} value={anime.id}>{anime.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Season Number</label>
              <input 
                type="number" name="seasonNumber" value={formData.seasonNumber} onChange={handleChange} min="1"
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Episode Number</label>
              <input 
                type="number" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} min="1"
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Episode Title (Optional)</label>
              <input 
                type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
                placeholder="e.g. The Awakening"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Video URL (For the Watch Page)</label>
            <input 
              type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
              placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
              required
            />
          </div>

          <div className="mt-6 border-t border-(--color-border-custom) pt-6">
            <h3 className="text-lg font-bold text-(--color-gold-primary) mb-4">Download Links (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">720p Link</label>
                <input type="text" name="dl720p" value={formData.dl720p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">720p Size</label>
                <input type="text" name="size720p" value={formData.size720p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">480p Link</label>
                <input type="text" name="dl480p" value={formData.dl480p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">480p Size</label>
                <input type="text" name="size480p" value={formData.size480p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">360p Link</label>
                <input type="text" name="dl360p" value={formData.dl360p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">360p Size</label>
                <input type="text" name="size360p" value={formData.size360p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">240p Link</label>
                <input type="text" name="dl240p" value={formData.dl240p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-text-primary) mb-2">240p Size</label>
                <input type="text" name="size240p" value={formData.size240p} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom)" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50">
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Episode"}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}