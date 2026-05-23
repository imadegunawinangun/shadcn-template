import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Update protected route to match any locale prefix
const isProtectedRoute = createRouteMatcher(["/(.*)/dashboard(.*)", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
  
  // Bypass next-intl middleware for API routes to prevent 307 redirects to /[locale]/api/...
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return;
  }
  
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|pptx?)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
