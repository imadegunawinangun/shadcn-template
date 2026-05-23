import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Hanya sign-in dan sign-up yang boleh diakses tanpa login
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Lewati Next.js internals dan file statis
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Selalu jalankan untuk rute API
    '/(api|trpc)(.*)',
  ],
};
