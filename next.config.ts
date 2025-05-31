import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      '@': './app',
    },
  },
};

export default nextConfig;
