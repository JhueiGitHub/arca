import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const { name, parentId } = await req.json();
    const { folderId } = params;

    const updatedFolder = await db.folder.update({
      where: { id: folderId },
      data: { name, parentId },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.log("[FOLDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const { folderId } = params;

    await db.folder.delete({
      where: { id: folderId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[FOLDER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
