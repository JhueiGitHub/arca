import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(req: Request) {
  try {
    const profile = await initialProfile();
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
        position, // Add the position field
        profileId: profile.id,
        parentId: parentId === "root" ? null : parentId,
        profile: { connect: { id: profile.id } }, // Connect the profile
        type: "folder", // Set the type explicitly
      },
    });

    return NextResponse.json(folder);
  } catch (error) {
    console.log("[FOLDERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
