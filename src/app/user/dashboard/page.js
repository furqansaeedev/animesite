import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Play, List, Heart } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // Fetch directly from DB (No API needed!)
  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } });
  const watchlistCount = await prisma.watchlist.count({ where: { userId: session.user.id } });
  const favoritesCount = await prisma.favorite.count({ where: { userId: session.user.id } });

  return (
    <div className="flex flex-col gap-6">
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
          <span className="text-3xl font-bold text-(--color-text-primary)">0</span>
          <span className="text-sm text-(--color-text-secondary)">Episodes Watched</span>
        </div>
      </div>
    </div>
  );
}