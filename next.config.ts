import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'api.ts', 'mw.ts'],
};
export default nextConfig;
