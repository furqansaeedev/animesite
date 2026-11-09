"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ManageAnime() {
  const router = useRouter();
  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnime = async () => {
    const res = await fetch("/api/admin/anime");
    if (res.ok) {
      const data = await res.json();
      setAnimeList(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnime();
  }, []);

  const handleDelete = async (id) => {
    // No confirmation popup. Deletes instantly.
    const res = await fetch(`/api/admin/anime/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchAnime(); // Refresh the list
    } else {
      alert("Failed to delete anime.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Manage Anime</h1>
        <Link 
          href="/admin/anime/new" 
          className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} /> Add New Anime
        </Link>
      </div>

      <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-(--color-gold-primary) animate-pulse">Loading anime...</div>
        ) : animeList.length === 0 ? (
          <div className="p-8 text-center text-(--color-text-secondary)">No anime found. Click "Add New Anime" to create one.</div>
        ) : (
          <table className="w-full text-left text-sm text-(--color-text-primary)">
            <thead className="bg-(--color-bg-card) border-b border-(--color-border-custom)">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animeList.map((anime) => (
                <tr key={anime.id} className="border-b border-(--color-border-custom) hover:bg-(--color-bg-card) transition-colors">
                  <td className="px-4 py-3">{anime.title}</td>
                  <td className="px-4 py-3">{anime.type || "N/A"}</td>
                  <td className="px-4 py-3">{anime.status || "N/A"}</td>
                  <td className="px-4 py-3">{anime.score || "N/A"}</td>
                  <td className="px-4 py-3 flex items-center justify-end gap-2">
                    {/* Edit Button - Links to edit page */}
                    <Link href={`/admin/anime/edit/${anime.id}`} className="p-2 text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
                      <Edit size={16} />
                    </Link>
                    {/* Delete Button - Deletes instantly */}
                    <button onClick={() => handleDelete(anime.id)} className="p-2 text-(--color-text-secondary) hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}