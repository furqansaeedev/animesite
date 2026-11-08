import Link from "next/link";
import { Play, Plus, Heart, Share2, Star, Calendar, Clock, Film, CheckCircle } from "lucide-react";

export default async function AnimeDetails({ params }) {
  const { slug } = await params;

  const formattedTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const anime = {
    title: formattedTitle,
    slug: slug,
    synopsis: "In a world where hunters, humans who possess magical abilities, must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival. One day, after narrowly surviving an overwhelmingly powerful double dungeon that nearly wipes out his entire party, a mysterious program called the System chooses him as its sole player and in turn, gives him the extremely rare ability to level up in strength, possibly beyond any known limits.",
    type: "TV",
    status: "Finished Airing",
    studio: "A-1 Pictures",
    releaseDate: "Jan 7, 2024",
    duration: "24 min",
    score: 8.3,
    quality: "HD",
    genres: ["Action", "Adventure", "Fantasy"],
  };

  return (
    <div className="flex flex-col w-full pb-12">
      
      {/* Banner Area */}
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden border border-(--color-border-custom) -mb-16 md:-mb-24 z-0">
        <div className="absolute inset-0 bg-linear-to-t from-(--color-bg-main) via-bg-main/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-(--color-bg-secondary) flex items-center justify-center">
          <span className="text-(--color-border-custom)">Banner Image</span>
        </div>
      </div>

      <div className="relative z-20 px-4 md:px-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl mx-auto w-full">
        {/* Poster */}
        <div className="w-40 md:w-56 shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden border-2 border-(--color-border-custom) shadow-2xl bg-(--color-bg-card) aspect-2/3">
           <div className="w-full h-full flex items-center justify-center text-(--color-text-secondary) text-sm">Poster Image</div>
        </div>

        {/* Details Info */}
        <div className="flex-1 flex flex-col pt-2 md:pt-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-(--color-text-primary) text-center md:text-left mb-2">
            {anime.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-(--color-gold-primary) bg-gold-primary/10 px-2 py-1 rounded">
              <Star size={14} fill="currentColor" /> {anime.score}
            </span>
            <span className="bg-(--color-bg-card) text-(--color-text-primary) px-2 py-1 rounded border border-(--color-border-custom)">{anime.type}</span>
            <span className="bg-(--color-bg-card) text-(--color-text-primary) px-2 py-1 rounded border border-(--color-border-custom)">{anime.quality}</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary)"><Calendar size={14} /> {anime.releaseDate}</span>
            <span className="flex items-center gap-1 text-(--color-text-secondary)"><Clock size={14} /> {anime.duration}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-6">
            {anime.genres.map((genre) => (
              <Link key={genre} href={`/genre/${genre.toLowerCase()}`} className="text-xs text-(--color-text-secondary) hover:text-(--color-gold-primary) border border-(--color-border-custom) hover:border-(--color-gold-primary) px-3 py-1 rounded-full transition-colors">{genre}</Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
            <Link href={`/watch/${anime.slug}-episode-1`} className="flex items-center gap-2 bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-8 rounded-full transition-colors">
              <Play fill="currentColor" size={18} /> Watch Now
            </Link>
            <button className="flex items-center gap-2 bg-(--color-bg-card) hover:bg-(--color-bg-secondary) border border-(--color-border-custom) text-(--color-text-primary) font-medium py-2 px-4 rounded-full transition-colors">
              <Plus size={18} /> Watchlist
            </button>
            <button className="flex items-center gap-2 bg-(--color-bg-card) hover:bg-(--color-bg-secondary) border border-(--color-border-custom) text-(--color-text-primary) font-medium py-2 px-4 rounded-full transition-colors">
              <Heart size={18} /> Favorite
            </button>
          </div>
        </div>
      </div>

      {/* Synopsis & Details Section */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Synopsis */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-(--color-text-primary) mb-3 border-b border-(--color-border-custom) pb-2">Synopsis</h2>
          <p className="text-(--color-text-secondary) text-sm leading-relaxed">
            {anime.synopsis}
          </p>
        </div>

        {/* Right Column - Metadata */}
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-5 h-fit">
          <h3 className="text-lg font-bold text-(--color-gold-primary) mb-4">Information</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Status</span>
              <span className="text-(--color-text-primary) font-medium flex items-center gap-1"><CheckCircle size={14} className="text-green-500"/> {anime.status}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Studio</span>
              <span className="text-(--color-text-primary) font-medium">{anime.studio}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Type</span>
              <span className="text-(--color-text-primary) font-medium flex items-center gap-1"><Film size={14}/> {anime.type}</span>
            </li>
            <li className="flex justify-between border-b border-(--color-bg-secondary) pb-2">
              <span className="text-(--color-text-secondary)">Release Date</span>
              <span className="text-(--color-text-primary) font-medium">{anime.releaseDate}</span>
            </li>
            <li className="flex justify-between pb-1">
              <span className="text-(--color-text-secondary)">Share</span>
              <button className="text-(--color-text-primary) hover:text-(--color-gold-primary) transition-colors"><Share2 size={16} /></button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}