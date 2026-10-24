import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, UserCreateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/users - List users (placeholder for admin functionality)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    const users = await prisma.user.findMany({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Do not return passwordHash for security
      },
    });

    return NextResponse.json<ApiResponse>({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create user
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UserCreateRequest;

    if (!body.email) {
      return NextResponse.json<ApiResponse>(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || "",
        passwordHash: body.passwordHash || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Do not return passwordHash
      },
    });

    return NextResponse.json<ApiResponse>({ data: user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
