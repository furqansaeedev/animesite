"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ChevronLeft, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";

export default function DownloadUI({ episodeId, formattedTitle, currentEpNum, downloadUrls }) {
  
  // If you haven't set up downloadUrls in your DB yet, we use this default mock list.
  // Later, you can map over `downloadUrls` from the database instead.
  const qualities = [
    { label: "1080p", size: "1.2 GB", available: true, url: downloadUrls?.["1080p"] || "#" },
    { label: "720p", size: "650 MB", available: true, url: downloadUrls?.["720p"] || "#" },
    { label: "480p", size: "350 MB", available: true, url: downloadUrls?.["480p"] || "#" },
    { label: "360p", size: "180 MB", available: true, url: downloadUrls?.["360p"] || "#" },
    { label: "240p", size: "90 MB", available: false, url: "#" }, // Example of unavailable
  ];

  const [selectedQuality, setSelectedQuality] = useState(null);
  const [downloadState, setDownloadState] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    if (!selectedQuality) return;
    setDownloadState("preparing");
    
    // Simulate preparing download
    setTimeout(() => {
      setDownloadState("downloading");
      
      // Simulate download progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 5;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          setDownloadState("completed");
          
          // In a real app, you would trigger the actual file download here
          // window.location.href = qualities.find(q => q.label === selectedQuality).url;
        }
      }, 200);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full min-h-[80vh] items-center justify-center py-10 px-4">
      
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <Link href={`/watch/${episodeId}`} className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Back to Player
        </Link>
      </div>

      {/* Main Download Panel */}
      <div className="w-full max-w-2xl bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-6 md:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8 border-b border-(--color-border-custom) pb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-(--color-text-primary) mb-2">{formattedTitle}</h1>
          <p className="text-(--color-gold-primary) font-bold">Episode {currentEpNum}</p>
          <h2 className="text-lg text-(--color-text-secondary) mt-4">Select Quality to Download</h2>
        </div>

        {/* Quality Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {qualities.map((q) => (
            <button
              key={q.label}
              disabled={!q.available || downloadState !== "idle" && downloadState !== "completed"}
              onClick={() => setSelectedQuality(q.label)}
              className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                !q.available
                  ? "bg-(--color-bg-secondary) border-(--color-border-custom) opacity-50 cursor-not-allowed"
                  : selectedQuality === q.label
                  ? "bg-(--color-bg-secondary) border-(--color-gold-primary) shadow-[0_0_15px_rgba(201,164,76,0.2)]"
                  : "bg-(--color-bg-secondary) border-(--color-border-custom) hover:border-(--color-gold-primary)"
              }`}
            >
              <div className="flex flex-col items-start">
                <span className={`text-lg font-bold ${selectedQuality === q.label ? "text-(--color-gold-primary)" : "text-(--color-text-primary)"}`}>
                  {q.label}
                </span>
                <span className="text-xs text-(--color-text-secondary) flex items-center gap-1 mt-1">
                  <HardDrive size={12} /> {q.size}
                </span>
              </div>
              
              {selectedQuality === q.label && q.available && (
                <CheckCircle2 className="text-(--color-gold-primary)" size={24} />
              )}
              
              {!q.available && (
                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                  Unavailable
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action / Progress Area */}
        <div className="flex flex-col gap-4">
          {downloadState === "idle" || downloadState === "completed" ? (
            <button
              onClick={handleDownload}
              disabled={!selectedQuality}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all ${
                selectedQuality
                  ? "bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main)"
                  : "bg-(--color-bg-secondary) text-(--color-text-secondary) cursor-not-allowed border border-(--color-border-custom)"
              }`}
            >
              <Download size={20} />
              {downloadState === "completed" ? "Download Again" : "Start Download"}
            </button>
          ) : (
            <div className="w-full bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-5 flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-(--color-gold-primary)">
                  {downloadState === "preparing" ? "Preparing download..." : "Downloading..."}
                </span>
                <span className="text-(--color-text-primary)">{progress}%</span>
              </div>
              
              <div className="w-full h-3 bg-(--color-border-custom) rounded-full overflow-hidden">
                <div className="h-full bg-(--color-gold-primary) transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              
              <div className="flex justify-between text-xs text-(--color-text-secondary) mt-1">
                <span>Status: {downloadState}</span>
                <span>{Math.floor((progress / 100) * parseInt(selectedQuality))} MB / {qualities.find(q => q.label === selectedQuality)?.size}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="mt-8 bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-lg p-4 flex gap-3 text-xs text-(--color-text-secondary)">
          <AlertCircle className="shrink-0 text-(--color-gold-primary)" size={18} />
          <p><strong>Notice:</strong> Higher video qualities may require more bandwidth. File sizes vary depending on the episode and quality. Availability depends on the authorized source. This is a simulated download interface for demonstration purposes.</p>
        </div>

      </div>
    </div>
  );
}