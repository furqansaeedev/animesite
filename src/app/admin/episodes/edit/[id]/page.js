"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditEpisodePage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [animeList, setAnimeList] = useState([]);
  
  const [formData, setFormData] = useState({
    animeId: "",
    episodeNumber: 1,
    title: "",
    videoUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      // Fetch anime list for the dropdown
      const animeRes = await fetch("/api/admin/anime");
      if (animeRes.ok) {
        const animeData = await animeRes.json();
        setAnimeList(animeData);
      }

      // Fetch episode data to edit
      const epRes = await fetch(`/api/admin/episodes/${id}`);
      if (epRes.ok) {
        const epData = await epRes.json();
        setFormData({
          animeId: epData.animeId,
          episodeNumber: epData.episodeNumber,
          title: epData.title || "",
          videoUrl: epData.videoUrl || "",
        });
      } else {
        setError("Failed to load episode data");
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === "episodeNumber" ? Number(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/episodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update episode");
      }

      router.push("/admin/episodes");
      router.refresh();

    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-(--color-gold-primary) animate-pulse">Loading...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/episodes" className="p-2 rounded-full bg-(--color-bg-secondary) text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Edit Episode</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Episode Number</label>
            <input 
              type="number" 
              name="episodeNumber" 
              value={formData.episodeNumber} 
              onChange={handleChange}
              min="1"
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Episode Title (Optional)</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Video URL</label>
          <input 
            type="text" 
            name="videoUrl" 
            value={formData.videoUrl} 
            onChange={handleChange}
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            required
          />
        </div>

        <div className="flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Update Episode"}
          </button>
        </div>
      </form>
    </div>
  );
}