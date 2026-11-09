"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditAnimePage({ params }) {
  const router = useRouter();
  // Unwrap params for Next.js 16
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    posterUrl: "",
    bannerUrl: "",
    type: "TV",
    status: "Finished Airing",
    releaseYear: 2024,
    score: 0,
    totalEpisodes: 12,
    quality: "HD",
  });

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return; // Wait for id to be available
      
      try {
        const res = await fetch(`/api/admin/anime/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || "",
            synopsis: data.synopsis || "",
            posterUrl: data.posterUrl || "",
            bannerUrl: data.bannerUrl || "",
            type: data.type || "TV",
            status: data.status || "Finished Airing",
            releaseYear: data.releaseYear || 2024,
            score: data.score || 0,
            totalEpisodes: data.totalEpisodes || 12,
            quality: data.quality || "HD",
          });
        } else {
          setError("Failed to load anime data");
        }
      } catch (err) {
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnime();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: (name === "releaseYear" || name === "score" || name === "totalEpisodes") ? Number(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/anime/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update anime");
      }

      router.push("/admin/anime");
      router.refresh();

    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-(--color-gold-primary) animate-pulse p-8">Loading anime data...</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/anime" className="p-2 rounded-full bg-(--color-bg-secondary) text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Edit Anime</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div>
          <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Anime Title</label>
          <input 
            type="text" name="title" value={formData.title} onChange={handleChange}
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Synopsis</label>
          <textarea 
            name="synopsis" value={formData.synopsis} onChange={handleChange} rows="3"
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Poster Image URL</label>
            <input 
              type="text" name="posterUrl" value={formData.posterUrl} onChange={handleChange}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Banner Image URL</label>
            <input 
              type="text" name="bannerUrl" value={formData.bannerUrl} onChange={handleChange}
              className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors">
              <option value="TV">TV Series</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors">
              <option value="Ongoing">Ongoing</option>
              <option value="Finished Airing">Finished Airing</option>
              <option value="Upcoming">Upcoming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Quality</label>
            <select name="quality" value={formData.quality} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors">
              <option value="HD">HD</option>
              <option value="FHD">Full HD</option>
              <option value="4K">4K</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Release Year</label>
            <input type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Total Episodes</label>
            <input type="number" name="totalEpisodes" value={formData.totalEpisodes} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-primary) mb-2">Score (0-10)</label>
            <input type="number" step="0.1" name="score" value={formData.score} onChange={handleChange} className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors" />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50">
            <Save size={18} /> {isSaving ? "Saving..." : "Update Anime"}
          </button>
        </div>
      </form>
    </div>
  );
}