// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // 👈 this enables SSR support
  },
  images: {
    domains: ['flagcdn.com', 'media.sellup.pk', 'via.placeholder.com'],
  },
  remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
  async rewrites() {
    return [
      {
        source: '/mobiles/:id',
        destination: '/products/mobiles/:id',
      },
      {
        source: '/vehicles/:id',
        destination: '/products/vehicles/:id',
      },
      {
        source: '/bikes/:id',
        destination: '/products/bikes/:id',
      },
      {
        source: '/property-for-rent/:id',
        destination: '/products/property-for-rent/:id',
      },
      {
        source: '/property-for-sale/:id',
        destination: '/products/property-for-sale/:id',
      },
      {
        source: '/fashion-beauty/:id',
        destination: '/products/fashion-beauty/:id',
      },
    ];
  },
};

export default nextConfig;