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
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // STRICT CHECK: Block login if not verified
    if (!user.isVerified) {
      return NextResponse.json({ 
        error: "Please verify your email address before logging in. Check your inbox." 
      }, { status: 403 });
    }

    await setSession({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({ success: true, message: "Logged in successfully" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}