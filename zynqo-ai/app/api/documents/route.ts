import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, DocumentCreateRequest } from "@/lib/types";
import { getSessionUser } from "@/lib/auth";

// GET /api/documents - List documents with optional search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    const userId = user.id;
    const search = searchParams.get("search");

    const where: {
      userId: string;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        content?: { contains: string; mode: "insensitive" };
      }>;
    } = { userId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse>({ data: documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create document
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DocumentCreateRequest;

    const user = await getSessionUser();
    if (!user) return NextResponse.json<ApiResponse>({ error: "Authentication required" }, { status: 401 });
    if (!body.title || !body.content) {
      return NextResponse.json<ApiResponse>(
        { error: "title, content, and userId are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title: body.title,
        content: body.content,
        summary: body.summary || null,
        userId: user.id,
      },
    });

    return NextResponse.json<ApiResponse>({ data: document }, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}
