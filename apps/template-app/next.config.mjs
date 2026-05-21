import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@workspace/ui", 
    "@workspace/marketing", 
    "@workspace/database", 
    "@workspace/dashboard",
    "@workspace/auth",
    "@workspace/navigation",
    "@workspace/landing-page",
    "@workspace/assets",
    "@workspace/users",
    "@workspace/ai-assistant",
    "@workspace/settings",
    "@workspace/webmcp"
  ],
};

export default withNextIntl(nextConfig);

// Force server restart to clear Drizzle DB cache
