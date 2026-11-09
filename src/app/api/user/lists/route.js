import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { animeId, type } = body; // type will be 'watchlist' or 'favorite'

    if (type === "watchlist") {
      // Check if it exists first
      const existing = await prisma.watchlist.findUnique({
        where: { userId_animeId: { userId: session.user.id, animeId } }
      });

      if (existing) {
        // If it exists, remove it (toggle off)
        await prisma.watchlist.delete({
          where: { id: existing.id }
        });
        return NextResponse.json({ added: false, message: "Removed from watchlist" });
      } else {
        // If it doesn't exist, add it (toggle on)
        await prisma.watchlist.create({
          data: { userId: session.user.id, animeId }
        });
        return NextResponse.json({ added: true, message: "Added to watchlist" });
      }
    }

    if (type === "favorite") {
      const existing = await prisma.favorite.findUnique({
        where: { userId_animeId: { userId: session.user.id, animeId } }
      });

      if (existing) {
        await prisma.favorite.delete({
          where: { id: existing.id }
        });
        return NextResponse.json({ added: false, message: "Removed from favorites" });
      } else {
        await prisma.favorite.create({
          data: { userId: session.user.id, animeId }
        });
        return NextResponse.json({ added: true, message: "Added to favorites" });
      }
    }

    return NextResponse.json({ error: "Invalid list type" }, { status: 400 });

  } catch (error) {
    console.error("List API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}