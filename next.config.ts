import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
// const isDocker = process.env.DOCKER === 'true';

const standaloneConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: { '*': ['public/**/*', '.next/static/**/*'] },
};

const nextConfig: NextConfig = {
  // ...(isDocker ? standaloneConfig : {}),
  ...standaloneConfig,
  compress: isProd,
  turbopack: {
    resolveAlias: {
      '@': './app',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ombra.eu.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
