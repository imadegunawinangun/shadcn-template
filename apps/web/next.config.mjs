/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/payments", "@workspace/database", "@workspace/assets"],
}

export default nextConfig
