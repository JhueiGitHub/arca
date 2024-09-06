// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET() {
  try {
    const profile = await initialProfile();

    // Commit: Sidebar-completion
    // Fetch categories with associated folders
    const categories = await db.category.findMany({
      where: { profileId: profile.id },
      include: { folders: true },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const profile = await initialProfile();
    const { name } = await req.json();

    // Commit: Sidebar-completion
    // Create a new category
    const category = await db.category.create({
      data: {
        name,
        profileId: profile.id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
