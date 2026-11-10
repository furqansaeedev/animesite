import WatchUI from "./WatchUI";
import { prisma } from "@/lib/prisma";

export default async function WatchPage({ params, searchParams }) {
  const { episodeId } = await params;
  const { season } = await searchParams;
  
  const seasonNumber = parseInt(season) || 1;

  const episodeMatch = episodeId.match(/(.+)-episode-(\d+)/);
  
  let animeSlug = "unknown";
  let currentEpNum = 1;

  if (episodeMatch) {
    animeSlug = episodeMatch[1];
    currentEpNum = parseInt(episodeMatch[2]);
  }

  const anime = await prisma.anime.findUnique({
    where: { slug: animeSlug },
    include: {
      episodes: { orderBy: [{ seasonNumber: "asc" }, { episodeNumber: "asc" }] },
    }
  });

  if (!anime) {
    return <div className="text-white p-10">Anime not found</div>;
  }

  const title = anime.title;
  const allEpisodes = anime.episodes;
  
  const availableSeasons = [...new Set(allEpisodes.map(ep => ep.seasonNumber || 1))].sort((a, b) => a - b);

  const currentSeasonEpisodes = allEpisodes.filter(ep => (ep.seasonNumber || 1) === seasonNumber);
  const currentEpisode = currentSeasonEpisodes.find(ep => ep.episodeNumber === currentEpNum);

  // SAFE FALLBACK: If no video URL exists, use a test video so the player doesn't crash
  const safeVideoUrl = currentEpisode?.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const currentIndex = currentSeasonEpisodes.findIndex(ep => ep.episodeNumber === currentEpNum);
  const prevEpisode = currentIndex > 0 ? `${animeSlug}-episode-${currentSeasonEpisodes[currentIndex - 1].episodeNumber}` : null;
  const nextEpisode = currentIndex !== -1 && currentIndex < currentSeasonEpisodes.length - 1 ? `${animeSlug}-episode-${currentSeasonEpisodes[currentIndex + 1].episodeNumber}` : null;

  // Fetch Recommended Series
  const recommendedSeries = await prisma.anime.findMany({
    where: { id: { not: anime.id } },
    take: 6,
    orderBy: { score: "desc" }
  });

  return (
    <WatchUI 
      episodeId={episodeId}
      animeSlug={animeSlug}
      currentEpNum={currentEpNum}
      formattedTitle={title}
      episodes={currentSeasonEpisodes}
      prevEpisode={prevEpisode}
      nextEpisode={nextEpisode}
      videoUrl={safeVideoUrl} // <-- Passing the safe URL
      seasonNumber={seasonNumber}
      availableSeasons={availableSeasons}
      recommendedSeries={recommendedSeries}
    />
  );
}