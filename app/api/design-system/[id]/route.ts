// app/api/design-system/[id]/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;

    const token = await db.colorToken.findUnique({
      where: { id },
    });

    if (!token) {
      const fontToken = await db.fontToken.findUnique({
        where: { id },
      });

      if (!fontToken) {
        return new NextResponse("Token not found", { status: 404 });
      }

      return NextResponse.json(fontToken);
    }

    return NextResponse.json(token);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { name, value, parentId } = body;

    let updatedToken;
    const colorToken = await db.colorToken.findUnique({ where: { id } });

    if (colorToken) {
      updatedToken = await db.colorToken.update({
        where: { id },
        data: { name, value, parentId },
      });
    } else {
      updatedToken = await db.fontToken.update({
        where: { id },
        data: { name, value, parentId },
      });
    }

    return NextResponse.json(updatedToken);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;

    const colorToken = await db.colorToken.findUnique({ where: { id } });

    if (colorToken) {
      await db.colorToken.delete({ where: { id } });
    } else {
      await db.fontToken.delete({ where: { id } });
    }

    return new NextResponse("Token deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
