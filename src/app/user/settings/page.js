"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [settings, setSettings] = useState({
    autoNext: true,
    autoPlay: false,
    enableDub: false,
    showContinueWatching: true,
    language: "English",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/settings");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setSettings({
            autoNext: data.settings.autoNext,
            autoPlay: data.settings.autoPlay,
            enableDub: data.settings.enableDub,
            showContinueWatching: data.settings.showContinueWatching,
            language: data.settings.language,
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      let data;
      try {
        data = await res.json();
      } catch (err) {
        data = { error: "Server returned an invalid response" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage({ type: "success", text: "Settings saved successfully!" });
      
    } catch (error) {
      console.error("Save error:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (isLoading) return <div className="text-(--color-gold-primary) animate-pulse">Loading Settings...</div>;

  return (
    <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-8">
      <h1 className="text-2xl font-bold text-(--color-text-primary) mb-6 border-b border-(--color-border-custom) pb-4">Settings</h1>
      
      {message.text && (
        <div className={`p-3 rounded-lg mb-6 text-sm text-center ${message.type === "success" ? "bg-green-500/10 border border-green-500/50 text-green-500" : "bg-red-500/10 border border-red-500/50 text-red-500"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-(--color-text-primary)">Auto Next Episode</h3>
              <p className="text-xs text-(--color-text-secondary)">Automatically play the next episode.</p>
            </div>
            <button type="button" onClick={() => handleToggle("autoNext")} className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoNext ? "bg-(--color-gold-primary)" : "bg-(--color-border-custom)"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoNext ? "left-7" : "left-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-(--color-text-primary)">Auto Play</h3>
              <p className="text-xs text-(--color-text-secondary)">Start playing the video automatically.</p>
            </div>
            <button type="button" onClick={() => handleToggle("autoPlay")} className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoPlay ? "bg-(--color-gold-primary)" : "bg-(--color-border-custom)"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoPlay ? "left-7" : "left-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-(--color-text-primary)">Enable DUB</h3>
              <p className="text-xs text-(--color-text-secondary)">Play English Dubbed audio by default.</p>
            </div>
            <button type="button" onClick={() => handleToggle("enableDub")} className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableDub ? "bg-(--color-gold-primary)" : "bg-(--color-border-custom)"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enableDub ? "left-7" : "left-1"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-(--color-text-primary)">Show Continue Watching</h3>
              <p className="text-xs text-(--color-text-secondary)">Display watch progress on the homepage.</p>
            </div>
            <button type="button" onClick={() => handleToggle("showContinueWatching")} className={`w-12 h-6 rounded-full transition-colors relative ${settings.showContinueWatching ? "bg-(--color-gold-primary)" : "bg-(--color-border-custom)"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.showContinueWatching ? "left-7" : "left-1"}`} />
            </button>
          </div>
        </div>

        <hr className="border-(--color-border-custom)" />

        <div>
          <label className="block text-sm font-bold text-(--color-text-primary) mb-1">Anime Title Language</label>
          <p className="text-xs text-(--color-text-secondary) mb-3">Choose how anime titles are displayed.</p>
          <select 
            name="language" 
            value={settings.language} 
            onChange={handleChange}
            className="w-full bg-(--color-bg-secondary) text-(--color-text-primary) text-sm rounded-lg py-3 px-4 border border-(--color-border-custom) focus:outline-none focus:border-(--color-gold-primary) transition-colors appearance-none"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 px-8 rounded-lg transition-colors mt-4 disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>

      </form>
    </div>
  );
}