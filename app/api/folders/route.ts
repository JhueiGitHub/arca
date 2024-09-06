// app/api/folders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(req: Request) {
  try {
    const profile = await initialProfile();
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    // CHANGED: Updated query to fetch folders with correct parentId
    const folders = await db.folder.findMany({
      where: {
        profileId: profile.id,
        parentId: parentId === "root" ? null : parentId,
      },
    });

    // ADDED: Console log to debug API response
    console.log("API Response:", folders);

    return NextResponse.json(folders);
  } catch (error) {
    console.log("[FOLDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();
    const { name, parentId, position } = await req.json();

    const folder = await db.folder.create({
      data: {
        name,
        position,
        profileId: profile.id,
        parentId: parentId === "root" ? null : parentId,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.log("[FOLDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
