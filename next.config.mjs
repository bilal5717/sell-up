/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
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
      // Specific mobile-related routes
      {
        source: '/mobiles_:slug',
        destination: '/products/mobiles/:slug',
      },
      {
        source: '/mobiles',
        destination: '/products/mobiles',
      },
      {
        source: '/tablets',
        destination: '/products/mobiles/tablets',
      },
      {
        source: '/mobile-phones',
        destination: '/products/mobiles/mobile-phones',
      },
      {
        source: '/accessories',
        destination: '/products/mobiles/accessories',
      },
      {
        source: '/accessories/:type',
        destination: '/products/mobiles/accessories/:type',
      },
      {
        source: '/smart-watches',
        destination: '/products/mobiles/smart-watches',
      },
      // Specific vehicle-related routes
      {
        source: '/vehicles',
        destination: '/products/vehicles',
      },
      {
        source: '/bikes',
        destination: '/products/bikes',
      },
      {
        source: '/bikes/:type',
        destination: '/products/bikes/subCat/:type',
      },

      {
        source: '/property-for-rent',
        destination: '/products/property-for-rent',
      },
      {
        source: '/property-for-rent/:slug',
        destination: '/products/property-for-rent/:slug',
      },
      {
        source: '/property-for-sale',
        destination: '/products/property-for-sale',
      },
      {
        source: '/property-for-sale/:slug',
        destination: '/products/property-for-sale/:slug',
      },

      {
        source: '/fashion-beauty',
        destination: '/products/fashion-beauty',
      },
      {
        source: '/fashion-beauty/:slug',
        destination: '/products/fashion-beauty/:slug',
      },

      {
        source: '/business-industrial-agriculture',
        destination: '/products/business-industrial-agriculture',
      },
      {
        source: '/business-industrial-agriculture/:slug',
        destination: '/products/business-industrial-agriculture/:slug',
      },
      {
        source: '/:slug',
        destination: '/products/vehicles/:slug',
      },
    ];
  },
};

export default nextConfig;