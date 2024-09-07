import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    const dopaFile = await db.dopaFile.findUnique({
      where: { id: fileId },
    });

    return NextResponse.json(dopaFile);
  } catch (error) {
    console.log("[DOPA_FILE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;
    const { content } = await req.json();

    const updatedFile = await db.dopaFile.update({
      where: { id: fileId },
      data: { content },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.log("[DOPA_FILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    await db.dopaFile.delete({
      where: { id: fileId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.log("[DOPA_FILE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
