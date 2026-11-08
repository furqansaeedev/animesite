import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

// GET all episodes
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const episodes = await prisma.episode.findMany({
    include: { anime: { select: { title: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(episodes);
}

// Schema for creating an episode
const episodeSchema = z.object({
  animeId: z.string(),
  episodeNumber: z.number().min(1),
  title: z.string().optional(),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
});

// POST create episode
export async function POST(request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = episodeSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const newEpisode = await prisma.episode.create({
      data: result.data
    });

    return NextResponse.json(newEpisode, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error (Maybe duplicate episode number?)" }, { status: 500 });
  }
}