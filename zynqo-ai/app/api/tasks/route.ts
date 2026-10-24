import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, TaskCreateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/tasks - List tasks with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    const userId = user.id;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: {
      userId: string;
      status?: string;
      priority?: string;
    } = { userId };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({ data: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create task
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TaskCreateRequest;

    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    if (!body.title) {
      return NextResponse.json<ApiResponse>(
        { error: "title and userId are required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        status: body.status || "todo",
        priority: body.priority || "medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        userId: user.id,
      },
    });

    return NextResponse.json<ApiResponse>({ data: task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
