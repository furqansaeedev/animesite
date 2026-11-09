import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

// GET single anime for editing
export async function GET(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    const anime = await prisma.anime.findUnique({ 
      where: { id } 
    });
    
    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }
    
    return NextResponse.json(anime);
  } catch (error) {
    console.error("GET Anime Error:", error);
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
  }
}

// DELETE anime
export async function DELETE(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await prisma.anime.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// Schema for updating
const updateSchema = z.object({
  title: z.string().min(2),
  synopsis: z.string().optional(),
  posterUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  releaseYear: z.number().optional(),
  score: z.number().optional(),
  totalEpisodes: z.number().optional(),
  quality: z.string().optional(),
});

// PUT update anime
export async function PUT(request, { params }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const slug = result.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updatedAnime = await prisma.anime.update({
      where: { id },
      data: {
        ...result.data,
        slug,
      }
    });

    return NextResponse.json(updatedAnime);
  } catch (error) {
    console.error("PUT Anime Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}