import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, EventUpdateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });

    const event = await prisma.event.findFirst({
      where: { id, userId: user.id },
    });

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ data: event });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    const body = (await request.json()) as EventUpdateRequest;

    const existingEvent = await prisma.event.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingEvent) {
      return NextResponse.json<ApiResponse>(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const updateData: {
      title?: string;
      description?: string | null;
      startTime?: Date;
      endTime?: Date;
      location?: string | null;
    } = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description || null;
    if (body.startTime !== undefined)
      updateData.startTime = new Date(body.startTime);
    if (body.endTime !== undefined) updateData.endTime = new Date(body.endTime);
    if (body.location !== undefined)
      updateData.location = body.location || null;

    const event = await prisma.event.update({
      where: { id, userId: user.id },
      data: updateData,
    });

    return NextResponse.json<ApiResponse>({ data: event });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });

    const existingEvent = await prisma.event.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingEvent) {
      return NextResponse.json<ApiResponse>(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json<ApiResponse>({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
