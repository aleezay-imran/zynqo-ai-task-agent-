import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, TaskUpdateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/tasks/[id] - Get single task
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });

    const task = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!task) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ data: task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    const body = (await request.json()) as TaskUpdateRequest;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const updateData: {
      title?: string;
      description?: string | null;
      status?: string;
      priority?: string;
      dueDate?: Date | null;
    } = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined)
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;

    const task = await prisma.task.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    return NextResponse.json<ApiResponse>({ data: task });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      return NextResponse.json<ApiResponse>(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json<ApiResponse>({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
