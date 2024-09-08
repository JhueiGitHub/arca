import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
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
    },
  });

  return newProfile;
};

export const initializeAppData = async (appName: string, profileId: string) => {
  switch (appName) {
    case "finder":
      await initializeFinderData(profileId);
      break;
    case "obsidian":
      await initializeObsidianData(profileId);
      break;
    default:
      console.log(`No initialization needed for ${appName}`);
  }
};

async function initializeFinderData(profileId: string) {
  const existingFolder = await db.folder.findFirst({
    where: { profileId, name: "Home" },
  });

  if (!existingFolder) {
    await db.folder.create({
      data: {
        name: "Home",
        type: "folder",
        position: { x: 50, y: 50 },
        profileId: profileId,
      },
    });
  }
}

async function initializeObsidianData(profileId: string) {
  const existingNote = await db.note.findFirst({
    where: { profileId },
  });

  if (!existingNote) {
    await db.note.create({
      data: {
        title: "Welcome to Onyx",
        content: "This is your first note in Onyx!",
        profileId: profileId,
      },
    });
  }
}
