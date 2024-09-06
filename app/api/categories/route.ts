// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

export async function GET() {
  try {
    const profile = await initialProfile();
    const categories = await db.category.findMany({
      where: { profileId: profile.id },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
