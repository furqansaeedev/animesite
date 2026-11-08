import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { List } from "lucide-react";

export default async function WatchlistPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: { anime: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-(--color-bg-card) border border-(--color-border-custom) rounded-xl p-8 min-h-[50vh]">
      <h1 className="text-2xl font-bold text-(--color-text-primary) mb-6 border-b border-(--color-border-custom) pb-4">My Watchlist</h1>
      
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <List size={48} className="text-(--color-border-custom) mb-4" />
          <h2 className="text-lg font-bold text-(--color-text-primary)">Your watchlist is empty</h2>
          <p className="text-sm text-(--color-text-secondary) mt-1 mb-4">Start adding anime to keep track of what you want to watch.</p>
          <Link href="/anime" className="bg-(--color-gold-primary) hover:bg-(--color-gold-hover) text-(--color-bg-main) font-bold py-2 px-6 rounded-full transition-colors">
            Browse Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
           <p className="text-(--color-text-primary)">You have {watchlist.length} anime saved.</p>
        </div>
      )}
    </div>
  );
}