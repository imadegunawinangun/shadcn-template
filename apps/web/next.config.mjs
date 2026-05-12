/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/payments", "@workspace/database"],
}

export default nextConfig
