import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validation
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
      // If settings don't exist for some reason, create them
      const newSettings = await prisma.userSettings.create({
        data: { userId: session.user.id }
      });
      return NextResponse.json({ settings: newSettings });
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
    
    // Validate incoming data
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error.errors }, { status: 400 });
    }

    const updatedSettings = await prisma.userSettings.update({
      where: { userId: session.user.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("PUT Settings Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}