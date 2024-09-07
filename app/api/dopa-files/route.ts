import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET(req: Request) {
  try {
    const profile = await initialProfile();
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    const dopaFiles = await db.dopaFile.findMany({
      where: {
        profileId: profile.id,
        folderId: folderId === "root" ? null : folderId,
      },
    });

    return NextResponse.json(dopaFiles);
  } catch (error) {
    console.log("[DOPA_FILES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();
    const { name, content, folderId, position } = await req.json();

    const dopaFile = await db.dopaFile.create({
      data: {
        name,
        content,
        position, // Add the position field
        profileId: profile.id,
        folderId: folderId === "root" ? null : folderId,
        profile: { connect: { id: profile.id } }, // Connect the profile
      },
    });

    return NextResponse.json(dopaFile);
  } catch (error) {
    console.log("[DOPA_FILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
