import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 1. Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id }
    });

    // Save the new token
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt }
    });

    // Create the reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // 2. Send the email
    try {
      await transporter.sendMail({
        from: `"AIME Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Reset Your AIME Password",
        html: `
          <div style="background-color: #0B0D19; color: #F5F2E9; padding: 20px; font-family: sans-serif;">
            <h2 style="color: #C9A44C;">AIME Password Reset</h2>
            <p>You requested to reset your password. Click the button below to set a new one:</p>
            <a href="${resetLink}" style="background-color: #C9A44C; color: #0B0D19; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 20px 0;">
              Reset Password
            </a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p style="font-size: 12px; color: #A3A6B5;">This link expires in 1 hour.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // We don't fail the request if the email fails, but we log it.
    }

    // Return success and the link for local testing
    return NextResponse.json({ 
      success: true, 
      message: "Password reset link sent to your email!",
      resetLink: resetLink // Keep this so you can still test locally
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}