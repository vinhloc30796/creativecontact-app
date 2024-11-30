/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure remote image patterns for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', ''),
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Configure webpack to handle SVG files
  webpack(config) {
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
};

// Add development environment specific configuration
if (process.env.NODE_ENV === 'development') {
  nextConfig.images.remotePatterns.push({
    protocol: 'http',
    hostname: '127.0.0.1',
    port: '54321',
    pathname: '/storage/v1/object/public/**',
  });
}

export default nextConfig;
