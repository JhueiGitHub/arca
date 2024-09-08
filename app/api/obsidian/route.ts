// app/api/obsidian/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, push, set } from "firebase/database";
import { initialProfile } from "@/lib/initial-profile";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export async function GET() {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notesRef = ref(db, `notes/${profile.id}`);
    const snapshot = await get(notesRef);

    const notes: Note[] = [];
    snapshot.forEach((childSnapshot) => {
      notes.push({
        id: childSnapshot.key as string,
        ...(childSnapshot.val() as Omit<Note, "id">),
      });
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.log("[OBSIDIAN_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content } = await req.json();

    const newNoteRef = push(ref(db, `notes/${profile.id}`));
    const newNote: Omit<Note, "id"> = {
      title,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(newNoteRef, newNote);

    const note: Note = {
      id: newNoteRef.key as string,
      ...newNote,
    };

    return NextResponse.json(note);
  } catch (error) {
    console.log("[OBSIDIAN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
