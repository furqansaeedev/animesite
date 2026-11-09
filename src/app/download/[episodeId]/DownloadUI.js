"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ChevronLeft, HardDrive, CheckCircle2, AlertCircle } from "lucide-react";

export default function DownloadUI({ episodeId, formattedTitle, currentEpNum, downloadUrls }) {
  
  // Read real data from the database.
  const qualities = [
    { label: "1080p", size: downloadUrls?.["1080p"]?.size || "N/A", available: !!downloadUrls?.["1080p"]?.url, url: downloadUrls?.["1080p"]?.url || "" },
    { label: "720p", size: downloadUrls?.["720p"]?.size || "N/A", available: !!downloadUrls?.["720p"]?.url, url: downloadUrls?.["720p"]?.url || "" },
    { label: "480p", size: downloadUrls?.["480p"]?.size || "N/A", available: !!downloadUrls?.["480p"]?.url, url: downloadUrls?.["480p"]?.url || "" },
    { label: "360p", size: "N/A", available: false, url: "" },
    { label: "240p", size: "N/A", available: false, url: "" },
  ];

  const [selectedQuality, setSelectedQuality] = useState(null);
  const [downloadState, setDownloadState] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    if (!selectedQuality) return;
    
    const qualityData = qualities.find(q => q.label === selectedQuality);
    if (!qualityData || !qualityData.url) return;

    setDownloadState("downloading");
    setProgress(10);

    // Use an anchor tag to trigger the download. 
    // This bypasses the CORS error.
    const a = document.createElement("a");
    a.href = qualityData.url;
    a.download = `${formattedTitle}-Episode-${currentEpNum}-${selectedQuality}.mp4`;
    a.target = "_blank"; // Opens in a new tab if the server blocks direct downloads
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Show a fake progress bar just to give the user visual feedback
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setDownloadState("completed");
      }
      setProgress(currentProgress);
    }, 200);
  };

  const resetDownload = () => {
    setDownloadState("idle");
    setProgress(0);
    setSelectedQuality(null);
  };

  return (
    <div className="flex flex-col w-full min-h-[80vh] items-center justify-center py-10 px-4">
      
      <div className="w-full max-w-2xl mb-4">
        <Link href={`/watch/${episodeId}`} className="text-sm font-medium text-(--color-text-secondary) hover:text-(--color-gold-primary) transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Back to Player
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-(--color-bg-card) border border-(--color-border-custom) rounded-2xl p-6 md:p-8 shadow-2xl">
        
        <div className="text-center mb-8 border-b border-(--color-border-custom) pb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-(--color-text-primary) mb-2">{formattedTitle}</h1>
          <p className="text-(--color-gold-primary) font-bold">Episode {currentEpNum}</p>
          <h2 className="text-lg text-(--color-text-secondary) mt-4">Select Quality to Download</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {qualities.map((q) => (
            <button
              key={q.label}
              disabled={!q.available || downloadState === "downloading" || downloadState === "completed"}
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

        <div className="flex flex-col gap-4">
          {downloadState === "idle" ? (
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
              Start Download
            </button>
          ) : downloadState === "completed" ? (
            <div className="flex flex-col gap-3">
              <div className="w-full flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/50 text-green-500 font-bold py-3 rounded-xl">
                <CheckCircle2 size={20} /> Download Initiated
              </div>
              <button onClick={resetDownload} className="text-sm text-(--color-text-secondary) hover:text-(--color-gold-primary) underline">
                Download another quality
              </button>
            </div>
          ) : (
            <div className="w-full bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-xl p-5 flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-(--color-gold-primary)">Downloading...</span>
                <span className="text-(--color-text-primary)">{progress}%</span>
              </div>
              
              <div className="w-full h-3 bg-(--color-border-custom) rounded-full overflow-hidden">
                <div className="h-full bg-(--color-gold-primary) transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-(--color-text-secondary) mt-2">
                If the download does not start automatically, check your browser's downloads folder.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-(--color-bg-secondary) border border-(--color-border-custom) rounded-lg p-4 flex gap-3 text-xs text-(--color-text-secondary)">
          <AlertCircle className="shrink-0 text-(--color-gold-primary)" size={18} />
          <p><strong>Notice:</strong> File sizes vary depending on the episode and quality. Availability depends on the authorized source.</p>
        </div>

      </div>
    </div>
  );
}