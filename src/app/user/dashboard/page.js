import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, List, Heart, Clock } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  const watchlistCount = await prisma.watchlist.count({ where: { userId: session.user.id } });
  const favoritesCount = await prisma.favorite.count({ where: { userId: session.user.id } });

  // Fetch watch progress with episode and anime details
  const continueWatching = await prisma.watchProgress.findMany({
    where: { 
      userId: session.user.id, 
      completed: false,
      progressSeconds: { gt: 10 } 
    },
    include: {
      episode: {
        include: { anime: true }
      }
    },
    orderBy: { updatedAt: "desc" },
    take: 6
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-8">
        <h1 className="text-3xl font-bold text-(--color-text-primary) mb-2">
          Welcome back, <span className="text-(--color-gold-primary)">{profile?.displayName || "User"}</span>!
        </h1>
        <p className="text-(--color-text-secondary)">Here is a summary of your anime activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <List className="text-(--color-gold-primary) mb-2" size={32} />
          <span className="text-3xl font-bold text-(--color-text-primary)">{watchlistCount}</span>
          <span className="text-sm text-(--color-text-secondary)">Anime in Watchlist</span>
        </div>
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Heart className="text-(--color-gold-primary) mb-2" size={32} />
          <span className="text-3xl font-bold text-(--color-text-primary)">{favoritesCount}</span>
          <span className="text-sm text-(--color-text-secondary)">Favorite Anime</span>
        </div>
        <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <Play className="text-(--color-gold-primary) mb-2" size={32} />
          <span className="text-3xl font-bold text-(--color-text-primary)">{continueWatching.length}</span>
          <span className="text-sm text-(--color-text-secondary)">Currently Watching</span>
        </div>
      </div>

      {continueWatching.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-(--color-text-primary) mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-(--color-gold-primary) rounded-full inline-block"></span>
            Continue Watching
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {continueWatching.map((progress) => (
              <Link 
                key={progress.id}
                href={`/watch/${progress.episode.anime.slug}-episode-${progress.episode.episodeNumber}?season=${progress.episode.seasonNumber}`}
                className="group relative flex bg-(--color-bg-card) rounded-lg overflow-hidden border border-(--color-border-custom) hover:border-(--color-gold-primary) transition-all duration-300"
              >
                <div className="w-24 h-32 shrink-0 overflow-hidden bg-(--color-bg-secondary)">
                  {progress.episode.anime.posterUrl ? (
                    <img src={progress.episode.anime.posterUrl} alt={progress.episode.anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-text-secondary) text-xs">No Img</div>
                  )}
                </div>
                <div className="p-3 flex flex-col justify-center gap-1">
                  <h3 className="text-sm font-bold text-(--color-text-primary) group-hover:text-(--color-gold-primary) line-clamp-2 transition-colors">
                    {progress.episode.anime.title}
                  </h3>
                  <p className="text-xs text-(--color-text-secondary)">
                    S{progress.episode.seasonNumber} E{progress.episode.episodeNumber}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-(--color-gold-primary) mt-1">
                    <Clock size={12} />
                    <span>{Math.floor(progress.progressSeconds / 60)} mins watched</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}