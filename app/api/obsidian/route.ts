// app/api/obsidian/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, push, set } from "firebase/database";
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

export async function GET() {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const itemsRef = ref(db, `items/${profile.id}`);
    const snapshot = await get(itemsRef);

    const items: NoteOrFolder[] = [];
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      items.push({
        id: childSnapshot.key as string,
        ...item,
      });
    });

    // Build the tree structure
    const buildTree = (items: NoteOrFolder[], parentId: string | null = null): NoteOrFolder[] => {
      return items
        .filter(item => item.parentId === parentId)
        .map(item => ({
          ...item,
          children: buildTree(items, item.id)
        }));
    };

    const treeStructure = buildTree(items);

    return NextResponse.json(treeStructure);
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

    const { name, isFolder, parentId, content } = await req.json();

    const newItemRef = push(ref(db, `items/${profile.id}`));
    const newItem: Omit<NoteOrFolder, "id"> = {
      name,
      isFolder,
      parentId,
      content: isFolder ? undefined : content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(newItemRef, newItem);

    const item: NoteOrFolder = {
      id: newItemRef.key as string,
      ...newItem,
    };

    return NextResponse.json(item);
  } catch (error) {
    console.log("[OBSIDIAN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}