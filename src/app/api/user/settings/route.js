import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  autoNext: z.boolean(),
  autoPlay: z.boolean(),
  enableDub: z.boolean(),
  showContinueWatching: z.boolean(),
  language: z.string(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    });

    if (!settings) {
      // If settings don't exist, return default values
      return NextResponse.json({ 
        settings: {
          autoNext: true,
          autoPlay: false,
          enableDub: false,
          showContinueWatching: true,
          language: "English"
        } 
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.errors }, { status: 400 });
    }

    // UPSERT: Updates the settings if they exist, creates them if they don't
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: result.data,
      create: {
        userId: session.user.id,
        ...result.data
      }
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("PUT Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}