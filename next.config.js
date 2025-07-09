import { withPayload } from '@payloadcms/next/withPayload';
import redirects from './redirects.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '35.154.57.8',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'ustudyglobal.in',
      }
    ],
  },
  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig);
