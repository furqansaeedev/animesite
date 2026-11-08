import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Helper to check admin role
async function checkAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") return false;
  return true;
}

// GET all anime
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anime = await prisma.anime.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(anime);
}

// Schema for creating anime
const animeSchema = z.object({
  title: z.string().min(2),
  synopsis: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  releaseYear: z.number().optional(),
  score: z.number().optional(),
  totalEpisodes: z.number().optional(),
  quality: z.string().optional(),
});

// POST create anime
export async function POST(request) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = animeSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Create a URL-friendly slug from the title
    const slug = result.data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newAnime = await prisma.anime.create({
      data: {
        ...result.data,
        slug,
        // Optionally set a default poster URL here
        posterUrl: "https://via.placeholder.com/400x600?text=No+Poster",
      }
    });

    return NextResponse.json(newAnime, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}