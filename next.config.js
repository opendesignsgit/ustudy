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
        hostname: '62.72.43.168',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'ktec.ustudy.academy',
      }
    ],
  },
  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig);
