// /app/api/obsidian/[noteId]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const note = await db.note.findUnique({
      where: {
        id: params.noteId,
        profileId: userId,
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.log("[OBSIDIAN_GET_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content } = await req.json();

    const updatedNote = await db.note.update({
      where: {
        id: params.noteId,
        profileId: userId,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.log("[OBSIDIAN_PATCH_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.note.delete({
      where: {
        id: params.noteId,
        profileId: userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[OBSIDIAN_DELETE_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
