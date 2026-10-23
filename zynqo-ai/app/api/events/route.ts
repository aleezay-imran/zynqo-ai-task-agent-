import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, EventCreateRequest } from "@/lib/types";

// GET /api/events - List events with date filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!userId) {
      return NextResponse.json<ApiResponse>(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const where: {
      userId: string;
      startTime?: { gte?: Date; lte?: Date };
    } = { userId };

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json<ApiResponse>({ data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create event
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EventCreateRequest;

    if (!body.title || !body.userId || !body.startTime || !body.endTime) {
      return NextResponse.json<ApiResponse>(
        { error: "title, userId, startTime, and endTime are required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description || null,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        location: body.location || null,
        userId: body.userId,
      },
    });

    return NextResponse.json<ApiResponse>({ data: event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
