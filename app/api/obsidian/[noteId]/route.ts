// app/api/obsidian/[noteId]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, set, remove } from "firebase/database";
import { initialProfile } from "@/lib/initial-profile";

interface NoteOrFolder {
  id: string;
  name: string;
  isFolder: boolean;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export async function GET(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemRef = ref(db, `items/${profile.id}/${params.noteId}`);
    const snapshot = await get(itemRef);

    if (!snapshot.exists()) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const item: NoteOrFolder = {
      id: snapshot.key as string,
      ...(snapshot.val() as Omit<NoteOrFolder, "id">),
    };

    return NextResponse.json(item);
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
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, content } = await req.json();

    const itemRef = ref(db, `items/${profile.id}/${params.noteId}`);
    const snapshot = await get(itemRef);

    if (!snapshot.exists()) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const updatedItem: Partial<NoteOrFolder> = {
      name,
      content,
      updatedAt: Date.now(),
    };

    await set(itemRef, { ...snapshot.val(), ...updatedItem });

    return NextResponse.json({ id: params.noteId, ...updatedItem });
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
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemRef = ref(db, `items/${profile.id}/${params.noteId}`);
    await remove(itemRef);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[OBSIDIAN_DELETE_NOTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
