// app/api/folders/[folderId]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    const { name, position, parentId, categoryId } = await req.json();
    const { folderId } = params;

    // Commit: Sidebar-completion
    // Update folder properties
    const updatedFolder = await db.folder.update({
      where: { id: folderId },
      data: {
        ...(name !== undefined && { name }),
        ...(position !== undefined && { position }),
        ...(parentId !== undefined && { parentId }),
        ...(categoryId !== undefined && { categoryId }),
      },
    });

    return NextResponse.json(updatedFolder);
  } catch (error) {
    console.log("[FOLDER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
