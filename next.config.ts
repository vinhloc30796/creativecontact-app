import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import path from 'path';

const imageHost = process.env.NEXT_PUBLIC_SUPABASE_URL || '127.0.0.1:54321';
const appHost = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
console.log('[next.config.ts] imageHost:', imageHost);

const nextConfig: NextConfig = {
  // Configure remote image patterns for Supabase storage
  images: {
    remotePatterns: [
      // Supabase Storage
      {
        protocol: 'https',
        hostname: imageHost.replace(/^https?:\/\//, '').split(':')[0],
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: imageHost.replace(/^http?:\/\//, '').split(':')[0],
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
      // Payload API Media
      {
        protocol: 'http',
        hostname: appHost.replace(/^http?:\/\//, '').split(':')[0],
        port: '3000',
        pathname: '/payload-api/media/**',
      },
      {
        protocol: 'https',
        hostname: appHost.replace(/^https?:\/\//, '').split(':')[0],
        port: '',
        pathname: '/payload-api/media/**',
      },
      // Added for picsum.photos
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure webpack to handle SVG files and add debugging
  webpack: (config) => {
    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          typescript: true,
          dimensions: false
        }
      }]
    });
    return config;
  },
  // Add proper i18n configuration
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
  experimental: {
    reactCompiler: false
  }
};

export default withPayload(nextConfig);
