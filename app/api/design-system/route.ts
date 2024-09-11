import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface TokenBase {
  id: string;
  name: string;
  value: string;
  designSystemId?: string;
  parentId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ColorToken extends TokenBase {}
interface FontToken extends TokenBase {}

export async function GET() {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const designSystem = await db.designSystem.findUnique({
      where: { profileId: profile.id },
      include: {
        colorTokens: true,
        fontTokens: true,
      },
    });

    if (!designSystem) {
      return new NextResponse("Design system not found", { status: 404 });
    }

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEM_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      colorTokens,
      fontTokens,
    }: { colorTokens: ColorToken[]; fontTokens: FontToken[] } =
      await req.json();

    // Remove designSystemId from tokens
    const cleanColorTokens = colorTokens.map(
      ({ designSystemId, createdAt, updatedAt, ...rest }: ColorToken) => rest
    );
    const cleanFontTokens = fontTokens.map(
      ({ designSystemId, createdAt, updatedAt, ...rest }: FontToken) => rest
    );

    const designSystem = await db.designSystem.upsert({
      where: { profileId: profile.id },
      update: {
        colorTokens: {
          deleteMany: {},
          create: cleanColorTokens,
        },
        fontTokens: {
          deleteMany: {},
          create: cleanFontTokens,
        },
      },
      create: {
        profileId: profile.id,
        colorTokens: {
          create: cleanColorTokens,
        },
        fontTokens: {
          create: cleanFontTokens,
        },
      },
      include: {
        colorTokens: true,
        fontTokens: true,
      },
    });

    return NextResponse.json(designSystem);
  } catch (error) {
    console.error("[DESIGN_SYSTEM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
