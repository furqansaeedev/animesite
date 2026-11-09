"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function ManageEpisodes() {
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEpisodes = async () => {
    const res = await fetch("/api/admin/episodes");
    if (res.ok) {
      const data = await res.json();
      setEpisodes(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const handleDelete = async (id) => {
    // No confirmation popup. Deletes instantly.
    const res = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchEpisodes(); // Refresh the list
    } else {
      alert("Failed to delete episode.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-(--color-text-primary)">Manage Episodes</h1>
        <Link 
          href="/admin/episodes/new" 
          className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Plus size={18} /> Add New Episode
        </Link>
      </div>

      <div className="bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-(--color-gold-primary) animate-pulse">Loading episodes...</div>
        ) : episodes.length === 0 ? (
          <div className="p-8 text-center text-(--color-text-secondary)">No episodes found. Add an anime first, then add episodes.</div>
        ) : (
          <table className="w-full text-left text-sm text-(--color-text-primary)">
            <thead className="bg-(--color-bg-card) border-b border-(--color-border-custom)">
              <tr>
                <th className="px-4 py-3 font-medium">Anime</th>
                <th className="px-4 py-3 font-medium">Ep #</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Video URL</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {episodes.map((ep) => (
                <tr key={ep.id} className="border-b border-(--color-border-custom) hover:bg-(--color-bg-card) transition-colors">
                  <td className="px-4 py-3">{ep.anime.title}</td>
                  <td className="px-4 py-3">{ep.episodeNumber}</td>
                  <td className="px-4 py-3">{ep.title || "N/A"}</td>
                  <td className="px-4 py-3 text-xs text-(--color-text-secondary) truncate max-w-50">{ep.videoUrl || "N/A"}</td>
                  <td className="px-4 py-3 flex items-center justify-end gap-2">
                    <Link href={`/admin/episodes/edit/${ep.id}`} className="p-2 text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(ep.id)} className="p-2 text-(--color-text-secondary) hover:text-red-400 transition-colors">
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