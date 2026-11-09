import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RandomPage() {
  // Fetch all anime IDs
  const animeList = await prisma.anime.findMany({
    select: { slug: true },
  });

  if (animeList.length === 0) {
    // If no anime exists, redirect to the homepage
    redirect("/");
  }

  // Pick a random anime
  const randomIndex = Math.floor(Math.random() * animeList.length);
  const randomAnime = animeList[randomIndex];

  // Redirect to that anime's details page
  redirect(`/anime/${randomAnime.slug}`);
}