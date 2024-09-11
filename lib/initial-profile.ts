import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      designSystem: {
        create: {
          colorTokens: {
            create: [
              { name: "primary", value: "#000000" },
              { name: "secondary", value: "#FFFFFF" },
            ],
          },
          fontTokens: {
            create: [
              { name: "heading", value: "Exemplar Pro" },
              { name: "body", value: "Dank Mono" },
            ],
          },
        },
      },
      notes: {
        create: {
          title: "Welcome Note",
          content: "Welcome to Obsidian!",
        },
      },
      folders: {
        create: {
          name: "Home",
          type: "folder",
          position: { x: 0, y: 0 },
        },
      },
    },
    include: {
      designSystem: {
        include: {
          colorTokens: true,
          fontTokens: true,
        },
      },
      notes: true,
      folders: true,
    },
  });

  return newProfile;
};
