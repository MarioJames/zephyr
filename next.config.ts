import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isDocker = process.env.DOCKER === 'true';

const standaloneConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: { '*': ['public/**/*', '.next/static/**/*'] },
};

const nextConfig: NextConfig = {
  ...(isDocker ? standaloneConfig : {}),
  compress: isProd,
  turbopack: {
    resolveAlias: {
      '@': './app',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'lobe.shabby.in',
        port: '9000',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
