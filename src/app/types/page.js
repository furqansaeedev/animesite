import Link from "next/link";
import { Film } from "lucide-react";

export default function TypesPage() {
  const types = ["TV", "Movie", "OVA", "ONA"];

  return (
    <div className="flex flex-col w-full pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
          <span className="w-2 h-8 bg-(--color-gold-primary) rounded-full inline-block"></span>
          Browse by Type
        </h1>
        <p className="text-(--color-text-secondary) mt-2">
          Filter anime by TV Series, Movies, OVAs, and more.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {types.map((type) => (
          <Link 
            key={type} 
            href={`/anime?type=${type}`} 
            className="bg-(--color-bg-card) border border-(--color-border-custom) hover:border-(--color-gold-primary) rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors group"
          >
            <Film className="text-(--color-text-secondary) group-hover:text-(--color-gold-primary) mb-4 transition-colors" size={32} />
            <span className="text-xl font-bold text-(--color-text-primary) group-hover:text-(--color-gold-primary) transition-colors">
              {type === "TV" ? "TV Series" : type}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}