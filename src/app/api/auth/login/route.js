import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data provided" }, { status: 400 });
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Set secure HTTP-only cookie
    await setSession({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({ success: true, message: "Logged in successfully" }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}