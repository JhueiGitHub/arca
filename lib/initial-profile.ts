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
      folders: {
        create: [
          {
            name: "Home",
            type: "folder",
            position: { x: 50, y: 50 },
          },
        ],
      },
    },
    include: {
      folders: true,
    },
  });

  console.log("New profile with Home folder:", newProfile);

  return newProfile;
};
