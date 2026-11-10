"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, PictureInPicture, RotateCcw, RotateCw, Check, SkipForward } from "lucide-react";

export default function VideoPlayer({ videoUrl, episodeId, onVideoEnded }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main"); 
  
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeQuality, setActiveQuality] = useState("Auto");
  
  // Auto Next State
  const [autoNext, setAutoNext] = useState(true);

  // Load Auto Next setting from localStorage
  useEffect(() => {
    const savedAutoNext = localStorage.getItem("aime_autoNext");
    if (savedAutoNext !== null) setAutoNext(savedAutoNext === "true");
  }, []);

  const toggleAutoNext = () => {
    const newValue = !autoNext;
    setAutoNext(newValue);
    localStorage.setItem("aime_autoNext", newValue.toString());
  };

  const videoSources = {
    "720p": videoUrl, 
    "480p": videoUrl, 
    "360p": videoUrl, 
    "240p": "https://files.catbox.moe/k1uuea.mp4", 
  };

  const [currentSrc, setCurrentSrc] = useState(videoUrl);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skipTime = (amount) => {
    videoRef.current.currentTime += amount;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.log("PiP not supported");
    }
  };

  const changeSpeed = (speedStr) => {
    const speed = speedStr === "Normal" ? 1 : parseFloat(speedStr);
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setActiveMenu("main");
  };

  const changeQuality = (quality) => {
    const currentPos = videoRef.current.currentTime;
    const wasPlaying = !videoRef.current.paused;

    let newSrc = videoUrl;
    if (quality !== "Auto" && videoSources[quality]) {
      newSrc = videoSources[quality];
    }

    setActiveQuality(quality);
    setCurrentSrc(newSrc);
    setActiveMenu("main");

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentPos;
        videoRef.current.playbackRate = playbackSpeed;
        if (wasPlaying) videoRef.current.play();
      }
    }, 150);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (autoNext && onVideoEnded) {
      onVideoEnded();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSettingsOpen && !e.target.closest(".settings-menu")) {
        setIsSettingsOpen(false);
        setActiveMenu("main");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSettingsOpen]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group border border-(--color-border-custom)"
      onMouseLeave={() => setIsSettingsOpen(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={currentSrc} 
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span className="text-white text-xs font-bold drop-shadow-md">
          Quality: <span className="text-(--color-gold-primary)">{activeQuality}</span>
        </span>
        <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {activeQuality === "Auto" ? "HD" : activeQuality}
        </span>
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 pointer-events-none">
          <div className="bg-gold-primary/90 text-(--color-bg-main) p-4 rounded-full transform scale-100">
            <Play fill="currentColor" size={32} className="ml-1" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent pt-10 pb-2 px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        <div className="w-full flex items-center gap-3 mb-2">
          <input 
            type="range" 
            min="0" 
            max={duration || 0} 
            value={currentTime} 
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer accent-(--color-gold-primary) hover:h-2 transition-all"
          />
        </div>

        <div className="flex items-center justify-between text-white">
          
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-(--color-gold-primary) transition-colors">
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
            </button>
            
            <button onClick={() => skipTime(-10)} className="hover:text-(--color-gold-primary) transition-colors">
              <RotateCcw size={18} />
            </button>
            <button onClick={() => skipTime(10)} className="hover:text-(--color-gold-primary) transition-colors">
              <RotateCw size={18} />
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="hover:text-(--color-gold-primary) transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none accent-(--color-gold-primary)"
              />
            </div>

            <span className="text-xs font-medium ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            
            <button onClick={togglePiP} className="hover:text-(--color-gold-primary) transition-colors">
              <PictureInPicture size={20} />
            </button>

            <div className="relative settings-menu">
              <button 
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`transition-colors ${isSettingsOpen ? "text-(--color-gold-primary)" : "hover:text-(--color-gold-primary)"}`}
              >
                <Settings size={20} className={isSettingsOpen ? "rotate-90 transition-transform" : "transition-transform"} />
              </button>

              {isSettingsOpen && (
                <div className="absolute bottom-10 right-0 w-64 bg-[#1A1A1A] border border-gray-700 rounded-lg shadow-2xl text-sm overflow-hidden flex flex-col">
                  
                  {/* MAIN MENU (Auto Next is now directly here) */}
                  {activeMenu === "main" && (
                    <div className="flex flex-col py-2">
                      
                      <button onClick={toggleAutoNext} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors">
                        <span className="flex items-center gap-3">
                          <SkipForward size={16}/> Auto Next
                        </span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${autoNext ? "bg-(--color-gold-primary)" : "bg-gray-600"}`}>
                          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${autoNext ? "left-4.5" : "left-0.5"}`} />
                        </div>
                      </button>

                      <div className="w-full h-px bg-gray-700 my-1"></div>

                      <button onClick={() => setActiveMenu("speed")} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors">
                        <span className="flex items-center gap-3"><RotateCcw size={16}/> Playback Speed</span>
                        <span className="text-gray-400 text-xs">{playbackSpeed === 1 ? "Normal" : `${playbackSpeed}x`}</span>
                      </button>
                      <button onClick={() => setActiveMenu("quality")} className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors">
                        <span className="flex items-center gap-3"><Settings size={16}/> Quality</span>
                        <span className="text-gray-400 text-xs">{activeQuality} {activeQuality === "Auto" ? "(HD)" : ""}</span>
                      </button>
                    </div>
                  )}

                  {/* SPEED MENU */}
                  {activeMenu === "speed" && (
                    <div className="flex flex-col py-2 max-h-64 overflow-y-auto">
                      <button onClick={() => setActiveMenu("main")} className="px-4 py-2 text-gray-400 hover:text-white text-left border-b border-gray-700 mb-1">&larr; Back</button>
                      {["0.25x", "0.5x", "0.75x", "Normal", "1.25x", "1.5x", "2x"].map((speed) => (
                        <button 
                          key={speed} 
                          onClick={() => changeSpeed(speed)}
                          className={`px-4 py-2 hover:bg-gray-800 text-left flex justify-between items-center ${(speed === "Normal" && playbackSpeed === 1) || speed === `${playbackSpeed}x` ? "text-(--color-gold-primary)" : "text-gray-300"}`}
                        >
                          {speed}
                          {((speed === "Normal" && playbackSpeed === 1) || speed === `${playbackSpeed}x`) && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* QUALITY MENU */}
                  {activeMenu === "quality" && (
                    <div className="flex flex-col py-2 max-h-64 overflow-y-auto">
                      <button onClick={() => setActiveMenu("main")} className="px-4 py-2 text-gray-400 hover:text-white text-left border-b border-gray-700 mb-1">&larr; Back</button>
                      {["Auto", "720p", "480p", "360p", "240p"].map((q) => (
                        <button 
                          key={q} 
                          onClick={() => changeQuality(q)}
                          className={`px-4 py-2 hover:bg-gray-800 text-left flex justify-between items-center ${q === activeQuality ? "text-(--color-gold-primary)" : "text-gray-300"}`}
                        >
                          <span>{q} {q === "Auto" && <span className="text-xs text-gray-500 ml-1">(HD)</span>}</span>
                          {q === activeQuality && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="hover:text-(--color-gold-primary) transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}