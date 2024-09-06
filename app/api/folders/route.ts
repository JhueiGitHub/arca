// app/api/folders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();
    const { name, position } = await req.json();

    const folder = await db.folder.create({
      data: {
        name,
        position,
        profileId: profile.id,
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.log("[FOLDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const profile = await initialProfile();
    const folders = await db.folder.findMany({
      where: { profileId: profile.id },
    });
    return NextResponse.json(folders);
  } catch (error) {
    console.log("[FOLDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
