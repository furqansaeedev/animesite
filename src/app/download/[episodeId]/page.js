import DownloadUI from "./DownloadUI";
import { prisma } from "@/lib/prisma";

export default async function DownloadPage({ params }) {
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
      episodes: {
        where: { episodeNumber: currentEpNum }
      }
    }
  });

  // If the anime exists, use its title. Otherwise, fallback to a formatted slug
  const title = anime ? anime.title : animeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Pass the data to the UI. If the episode isn't in the DB, it will just use default mock download links.
  return (
    <DownloadUI 
      episodeId={episodeId}
      formattedTitle={title}
      currentEpNum={currentEpNum}
      downloadUrls={anime?.episodes[0]?.downloadUrls || null} 
    />
  );
}