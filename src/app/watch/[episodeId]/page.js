import WatchUI from "./WatchUI";
import { prisma } from "@/lib/prisma";

export default async function WatchPage({ params }) {
  const { episodeId } = await params;

  // Safely extract slug and episode number
  const episodeMatch = episodeId.match(/(.+)-episode-(\d+)/);
  
  let animeSlug = "unknown";
  let currentEpNum = 1;

  if (episodeMatch) {
    animeSlug = episodeMatch[1];
    currentEpNum = parseInt(episodeMatch[2]);
  }

  // Fetch from database
  const anime = await prisma.anime.findUnique({
    where: { slug: animeSlug },
    include: {
      episodes: { orderBy: { episodeNumber: "asc" } },
    }
  });

  // If the anime exists, use its title. Otherwise, fallback to a formatted slug
  const title = anime ? anime.title : animeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Find the episode
  const episodes = anime ? anime.episodes : [];
  const currentEpisode = episodes.find(ep => ep.episodeNumber === currentEpNum);

  // If no episode is found, we still render the UI but without a specific video URL
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
    />
  );
}