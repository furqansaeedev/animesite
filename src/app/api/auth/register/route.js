import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  // Stricter email validation: must have text, @, text, ., and at least 2 letters
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),
  password: z.string()
    .length(8, "Password must be exactly 8 characters")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character (e.g. @, #, $, !)"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { displayName, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: { displayName },
        },
        settings: {
          create: {}, 
        },
      },
    });

    return NextResponse.json({ success: true, message: "Registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}