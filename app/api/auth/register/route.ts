import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash the password
    const hashedPassword = await hash(password, 10);
    
    // Create default preferences
    const defaultPreferences = {
      newsCategories: ["technology", "business"],
      movieGenres: ["action", "drama"],
      socialHashtags: ["tech", "programming"],
      country: "us",
    };
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferences: defaultPreferences,
      },
    });
    
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}