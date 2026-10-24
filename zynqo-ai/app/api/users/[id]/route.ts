import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, UserUpdateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/users/[id] - Get user profile
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.id !== id) return NextResponse.json<ApiResponse>({ error: "Forbidden" }, { status: 403 });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Do not return passwordHash for security
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user profile
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.id !== id) return NextResponse.json<ApiResponse>({ error: "Forbidden" }, { status: 403 });
    const body = (await request.json()) as UserUpdateRequest;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json<ApiResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: {
      email?: string;
      name?: string;
      passwordHash?: string | null;
    } = {};

    if (body.email !== undefined) updateData.email = body.email;
    if (body.name !== undefined) updateData.name = body.name || "";
    if (body.passwordHash !== undefined)
      updateData.passwordHash = body.passwordHash || null;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        // Do not return passwordHash
      },
    });

    return NextResponse.json<ApiResponse>({ data: user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.id !== id) return NextResponse.json<ApiResponse>({ error: "Forbidden" }, { status: 403 });

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json<ApiResponse>(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse>({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
