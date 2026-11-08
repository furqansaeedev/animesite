"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedSlider({ featuredAnime }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredAnime.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredAnime.length]);

  if (!featuredAnime || featuredAnime.length === 0) return null;

  const currentAnime = featuredAnime[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === featuredAnime.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredAnime.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-100 md:h-125 rounded-xl overflow-hidden border border-(--color-border-custom) group">
      
      {/* Background Image/Banner Placeholder */}
      <div className="absolute inset-0 bg-linear-to-t from-(--color-bg-main) via-bg-main/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-(--color-bg-secondary) flex items-center justify-center z-0">
        <span className="text-(--color-border-custom)">Banner Image</span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 z-20 w-full md:w-2/3">
        <span className="inline-block bg-(--color-gold-primary) text-(--color-bg-main) text-xs font-bold px-2 py-1 rounded mb-4 uppercase tracking-wider">
          Featured
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-(--color-text-primary) mb-4 line-clamp-2">
          {currentAnime.title}
        </h2>
        <p className="text-(--color-text-secondary) text-sm md:text-base mb-6 line-clamp-3">
          {currentAnime.synopsis}
        </p>
        <div className="flex items-center gap-4">
          <Link 
            href={`/watch/${currentAnime.slug}-episode-1`}
            className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-6 rounded-full transition-colors"
          >
            <Play fill="currentColor" size={18} />
            Watch Now
          </Link>
          <Link 
            href={`/anime/${currentAnime.slug}`}
            className="flex items-center gap-2 bg-black/50 hover:bg-black/80 border border-(--color-border-custom) text-(--color-text-primary) font-bold py-2 px-6 rounded-full transition-colors backdrop-blur-sm"
          >
            <Info size={18} />
            Details
          </Link>
        </div>
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-(--color-gold-primary) text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-(--color-gold-primary) text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 z-30 flex gap-2">
        {featuredAnime.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-(--color-gold-primary) w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}