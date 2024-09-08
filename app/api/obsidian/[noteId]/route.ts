// app/api/obsidian/[noteId]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, update, remove } from "firebase/database";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const noteRef = ref(db, `notes/${profile.id}/${params.noteId}`);
    const snapshot = await get(noteRef);

    if (!snapshot.exists()) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const note = { id: snapshot.key, ...snapshot.val() };
    return NextResponse.json(note);
  } catch (error) {
    console.log("[OBSIDIAN_NOTE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content } = await req.json();
    const noteRef = ref(db, `notes/${profile.id}/${params.noteId}`);

    await update(noteRef, { title, content, updatedAt: Date.now() });

    const updatedNote = { id: params.noteId, title, content };
    return NextResponse.json(updatedNote);
  } catch (error) {
    console.log("[OBSIDIAN_NOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const noteRef = ref(db, `notes/${profile.id}/${params.noteId}`);
    await remove(noteRef);

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("[OBSIDIAN_NOTE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
