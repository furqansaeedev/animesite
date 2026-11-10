import Link from "next/link";
import { Play, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 text-center">
      
      {/* Glowing Background Effect */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none -z-10">
        <div className="w-125 h-125 bg-gold-primary/5 rounded-full blur-3xl"></div>
      </div>

      <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-(--color-gold-primary) to-(--color-gold-hover) mb-4 drop-shadow-lg">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold text-(--color-text-primary) mb-4">
        Lost in the Anime Multiverse?
      </h2>
      
      <p className="text-(--color-text-secondary) max-w-md mb-8">
        The page you are looking for doesn't exist, was removed, or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto justify-center"
        >
          <Home size={18} /> Back to Home
        </Link>
        
        <Link 
          href="/anime" 
          className="flex items-center gap-2 bg-(--color-bg-card) border border-(--color-border-custom) hover:border-(--color-gold-primary) text-(--color-text-primary) font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto justify-center"
        >
          <Search size={18} /> Browse Anime
        </Link>
      </div>

    </div>
  );
}