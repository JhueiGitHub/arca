// /app/api/obsidian/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notes = await db.note.findMany({
      where: { profileId: userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.log("[OBSIDIAN_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, parentId } = await req.json();

    const note = await db.note.create({
      data: {
        title,
        content,
        parentId,
        profileId: userId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[OBSIDIAN_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
