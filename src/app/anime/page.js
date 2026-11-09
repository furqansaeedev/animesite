import AnimeFilters from "./AnimeFilters";
import AnimeCard from "./AnimeCard";
import { prisma } from "@/lib/prisma";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";

export default async function AnimeListing({ searchParams }) {
  const params = await searchParams;
  
  const search = params.search || "";
  const type = params.type || "";
  const sort = params.sort || "recent";
  
  const page = parseInt(params.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = {
    AND: [
      search ? { title: { contains: search, mode: "insensitive" } } : {},
      type ? { type: type } : {},
    ]
  };

  let orderBy = { createdAt: "desc" };
  if (sort === "popular") orderBy = { score: "desc" };
  if (sort === "az") orderBy = { title: "asc" };

  const [animeList, totalCount] = await Promise.all([
    prisma.anime.findMany({ where, orderBy, skip, take: limit }),
    prisma.anime.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col w-full pb-12">
      
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-(--color-text-primary) flex items-center gap-3">
          <span className="w-2 h-8 bg-(--color-gold-primary) rounded-full inline-block"></span>
          Anime Directory
        </h1>
        <p className="text-(--color-text-secondary) mt-2">
          Discover your next favorite anime from our extensive library.
        </p>
      </div>

      <AnimeFilters />

      {animeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-(--color-bg-card) rounded-xl border border-(--color-border-custom) text-center">
          <SearchX size={48} className="text-(--color-border-custom) mb-4" />
          <h2 className="text-xl font-bold text-(--color-text-primary) mb-2">No results found</h2>
          <p className="text-(--color-text-secondary) max-w-md">
            {search 
              ? `We couldn't find any anime matching "${search}". Try a different search term or reset the filters.`
              : "No anime match the selected filters. Try resetting the filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {page > 1 && (
            <Link href={`/anime?page=${page - 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${sort ? `&sort=${sort}` : ''}`} className="flex items-center justify-center w-10 h-10 rounded-md border border-(--color-border-custom) text-(--color-text-secondary) hover:border-(--color-gold-primary) hover:text-(--color-gold-primary) transition-colors">
              <ChevronLeft size={20} />
            </Link>
          )}

          <span className="text-(--color-text-secondary) text-sm">
            Page {page} of {totalPages}
          </span>

          {page < totalPages && (
            <Link href={`/anime?page=${page + 1}${search ? `&search=${search}` : ''}${type ? `&type=${type}` : ''}${sort ? `&sort=${sort}` : ''}`} className="flex items-center justify-center w-10 h-10 rounded-md border border-(--color-border-custom) text-(--color-text-secondary) hover:border-(--color-gold-primary) hover:text-(--color-gold-primary) transition-colors">
              <ChevronRight size={20} />
            </Link>
          )}
        </div>
      )}

    </div>
  );
}