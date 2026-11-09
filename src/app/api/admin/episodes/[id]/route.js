import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

// GET single episode for editing
export async function GET(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const episode = await prisma.episode.findUnique({ where: { id } });
  return NextResponse.json(episode);
}

// DELETE episode
export async function DELETE(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.episode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Schema for updating
const updateSchema = z.object({
  animeId: z.string(),
  episodeNumber: z.number().min(1),
  title: z.string().optional(),
  videoUrl: z.string().optional(),
});

// PUT update episode
export async function PUT(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedEpisode = await prisma.episode.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(updatedEpisode);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}