import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const episodes = await prisma.episode.findMany({
    include: { anime: { select: { title: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(episodes);
}

export async function POST(request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    
    // Package download links into JSON format for the database
    const downloadUrls = {
      "1080p": { url: body.dl1080p || "", size: body.size1080p || "" },
      "720p": { url: body.dl720p || "", size: body.size720p || "" },
      "480p": { url: body.dl480p || "", size: body.size480p || "" },
    };

    const newEpisode = await prisma.episode.create({
      data: {
        animeId: body.animeId,
        episodeNumber: Number(body.episodeNumber),
        title: body.title,
        videoUrl: body.videoUrl,
        downloadUrls: downloadUrls,
      }
    });

    return NextResponse.json(newEpisode, { status: 201 });
  } catch (error) {
    console.error("Episode API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}