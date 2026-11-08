import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [anime, episodes, users, favorites] = await Promise.all([
      prisma.anime.count(),
      prisma.episode.count(),
      prisma.user.count(),
      prisma.favorite.count(),
    ]);

    return NextResponse.json({ anime, episodes, users, favorites });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}