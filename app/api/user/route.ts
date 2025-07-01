import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";

// Get current user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      preferences: true,
    },
  });

  return NextResponse.json(user);
}

// Update user preferences
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const data = await request.json();

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      preferences: data.preferences,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      preferences: true,
    },
  });

  return NextResponse.json(updatedUser);
}
