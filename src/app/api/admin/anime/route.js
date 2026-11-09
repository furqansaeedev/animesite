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
  const anime = await prisma.anime.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(anime);
}

const animeSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
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

export async function POST(request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validate the data
    const result = animeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { title } = result.data;
    
    // Create slug and ensure it is unique by adding a random string if needed
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    let slug = baseSlug;
    
    // Check if slug exists
    const existing = await prisma.anime.findUnique({ where: { slug } });
    if (existing) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    const newAnime = await prisma.anime.create({
      data: {
        ...result.data,
        slug,
      }
    });

    return NextResponse.json(newAnime, { status: 201 });

  } catch (error) {
    console.error("API ERROR:", error);
    // THIS IS THE FIX: Always return a valid JSON error message
    return NextResponse.json({ error: "Failed to create anime. Please try a different title." }, { status: 500 });
  }
}