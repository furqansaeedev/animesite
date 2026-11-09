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

  // Fetch anime with ONLY the episodes from the selected season
  const anime = await prisma.anime.findUnique({
    where: { slug: animeSlug },
    include: {
      episodes: { 
        where: { seasonNumber: seasonNumber },
        orderBy: { episodeNumber: "asc" } 
      },
    }
  });

  const title = anime ? anime.title : animeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const episodes = anime ? anime.episodes : [];
  const currentEpisode = episodes.find(ep => ep.episodeNumber === currentEpNum);

  const videoUrl = currentEpisode?.videoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const currentIndex = episodes.findIndex(ep => ep.episodeNumber === currentEpNum);
  const prevEpisode = currentIndex > 0 ? `${animeSlug}-episode-${episodes[currentIndex - 1].episodeNumber}` : null;
  const nextEpisode = currentIndex !== -1 && currentIndex < episodes.length - 1 ? `${animeSlug}-episode-${episodes[currentIndex + 1].episodeNumber}` : null;

  return (
    <WatchUI 
      episodeId={episodeId}
      animeSlug={animeSlug}
      currentEpNum={currentEpNum}
      formattedTitle={title}
      episodes={episodes}
      prevEpisode={prevEpisode}
      nextEpisode={nextEpisode}
      videoUrl={videoUrl} 
      seasonNumber={seasonNumber}
    />
  );
}