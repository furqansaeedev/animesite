import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registerSchema = z.object({
  displayName: z.string().min(2),
  email: z.string().email(),
  password: z.string().length(8).regex(/[^a-zA-Z0-9]/),
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
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user with isVerified: false
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        verificationToken,
        isVerified: false,
        profile: { create: { displayName } },
        settings: { create: {} },
      },
    });

    // Send Verification Email
    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    
    await transporter.sendMail({
      from: `"AIME Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your AIME Account",
      html: `
        <div style="background-color: #0B0D19; color: #F5F2E9; padding: 20px; font-family: sans-serif;">
          <h2 style="color: #C9A44C;">Welcome to AIME!</h2>
          <p>Please verify your email address to activate your account.</p>
          <a href="${verifyLink}" style="background-color: #C9A44C; color: #0B0D19; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0;">
            Verify Email
          </a>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Registered! Please check your email to verify your account." }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}