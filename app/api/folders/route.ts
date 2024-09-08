// app/api/finder/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(req: Request) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    const folders = await db.folder.findMany({
      where: {
        profileId: profile.id,
        parentId: parentId === "root" ? null : parentId,
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.log("[FINDER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, parentId, position } = await req.json();

    const folder = await db.folder.create({
      data: {
        name,
        position,
        profileId: profile.id,
        parentId: parentId === "root" ? null : parentId,
        type: "folder",
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.log("[FINDER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
