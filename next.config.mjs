/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Set to false to fail build on TS errors (recommended for production)
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
