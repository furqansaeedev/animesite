import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Save progress
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { episodeId, progressSeconds, completed } = await request.json();

    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    // Upsert the progress (update if exists, create if not)
    await prisma.watchProgress.upsert({
      where: {
        userId_episodeId: {
          userId: session.user.id,
          episodeId: episodeId,
        }
      },
      update: {
        progressSeconds,
        completed: completed || false,
      },
      create: {
        userId: session.user.id,
        episodeId: episodeId,
        progressSeconds,
        completed: completed || false,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get progress for a specific episode
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get("episodeId");

    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    const progress = await prisma.watchProgress.findUnique({
      where: {
        userId_episodeId: {
          userId: session.user.id,
          episodeId: episodeId,
        }
      }
    });

    return NextResponse.json({ progress: progress || null });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}