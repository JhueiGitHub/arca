import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
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
  ],
  debug: true,
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
