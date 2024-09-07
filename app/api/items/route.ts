import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get files by folder ID
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const folderId = url.searchParams.get("folderId");
    const parentId = url.searchParams.get("parentId");

    if (!folderId && !parentId) {
      return NextResponse.json(
        { error: "Missing folderId or parentId parameter" },
        { status: 400 }
      );
    }

    const items = await prisma.dopaFile.findMany({
      where: {
        OR: [
          { folderId: folderId || undefined },
          { folderId: parentId || undefined },
        ],
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Get a single file by ID
export async function GET_SINGLE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Fetch a single file from the database
    const file = await prisma.dopaFile.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update a file
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  // Parse JSON body
  const { content } = await request.json();

  try {
    // Update file in the database
    const updatedFile = await prisma.dopaFile.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
