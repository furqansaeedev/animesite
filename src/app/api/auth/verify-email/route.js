import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("http://localhost:3000/login?error=missing_token");
  }

  try {
    const user = await prisma.user.findUnique({ where: { verificationToken: token } });

    if (!user) {
      return NextResponse.redirect("http://localhost:3000/login?error=invalid_token");
    }

    // Update the user to be verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null }
    });

    return NextResponse.redirect("http://localhost:3000/login?verified=true");

  } catch (error) {
    return NextResponse.redirect("http://localhost:3000/login?error=server_error");
  }
}