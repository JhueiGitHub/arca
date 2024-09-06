import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
    include: {
      folders: true,
      categories: true,
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
    },
  });

  // Create initial "Home" folder
  await db.folder.create({
    data: {
      name: "Home",
      position: { x: 50, y: 50 },
      profileId: newProfile.id,
    },
  });

  // Create initial "Favorites" category
  await db.category.create({
    data: {
      name: "Favorites",
      profileId: newProfile.id,
    },
  });

  return newProfile;
};
