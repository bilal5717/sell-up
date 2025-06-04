/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['flagcdn.com', 'media.sellup.pk', 'via.placeholder.com'],
  },
  async rewrites() {
    return [
      // Specific mobile-related routes
     
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
        source: '/services',
        destination: '/products/services',
      },
      {
        source: '/services/:slug',
        destination: '/products/services/:slug',
      },
      {
        source: '/jobs',
        destination: '/products/jobs',
      },
      {
        source: '/jobs/:slug',
        destination: '/products/jobs/:slug',
      },
      {
        source: '/electronics-home-appliances',
        destination: '/products/electronics-home-appliances',
      },
      {
        source: '/electronics-home-appliances/:slug',
        destination: '/products/electronics-home-appliances/:slug',
      },
      {
        source: '/animals',
        destination: '/products/animals',
      },
      {
        source: '/animals/:slug',
        destination: '/products/animals/:slug',
      },
      {
        source: '/books-sports-hobbies',
        destination: '/products/books-sports-hobbies',
      },
      {
        source: '/books-sports-hobbies/:slug',
        destination: '/products/books-sports-hobbies/:slug',
      },
      {
        source: '/:slug',
        destination: '/products/vehicles/:slug',
      },
    ];
  },
};

export default nextConfig;