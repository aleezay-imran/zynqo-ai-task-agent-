import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse, DocumentUpdateRequest } from "@/lib/types";

// GET /api/documents/[id] - Get single document
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json<ApiResponse>(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({ data: document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update document
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as DocumentUpdateRequest;

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json<ApiResponse>(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const updateData: {
      title?: string;
      content?: string;
      summary?: string | null;
    } = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.summary !== undefined) updateData.summary = body.summary || null;

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json<ApiResponse>({ data: document });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete document
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existingDocument = await prisma.document.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json<ApiResponse>(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse>({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json<ApiResponse>(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
