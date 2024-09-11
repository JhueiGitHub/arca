import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/uploadthing",
    "/api/trpc/[trpc]",
    "/api/profile",
    "/api/initial-profile",
    "/api/sidebar-data",
    "/api/servers/(.*)",
    "/api/folders/(.*)",
    "/api/categories/(.*)",
    "/api/notes/(.*)",
    "/api/auth/(.*)",
    "/api/webhooks/clerk",
    "/api/design-system",
  ],
  ignoredRoutes: ["/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
