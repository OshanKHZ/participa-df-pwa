import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Reduce legacy JavaScript - use modern browser targets
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
}

export default nextConfig
