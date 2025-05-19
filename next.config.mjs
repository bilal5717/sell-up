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
        source: '/:slug',
        destination: '/products/mobiles/:slug',
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
       {
        source: '/electronics-home-appliances/:id',
        destination: '/products/electronics-home-appliances/:id',
      },
      {
        source: '/business-industrial-agriculture/:id',
        destination: '/products/business-industrial-agriculture/:id',
      },
      {
        source: '/services/:id',
        destination: '/products/services/:id',
      },
      {
        source: '/jobs/:id',
        destination: '/products/jobs/:id',
      },
      {
        source: '/animals/:id',
        destination: '/products/animals/:id',
      },
      {
        source: '/books-sports-hobbies/:id',
        destination: '/products/books-sports-hobbies/:id',
      },
      {
        source: '/furniture-home-decor/:id',
        destination: '/products/furniture-home-decor/:id',
      },
      {
        source: '/kids/:id',
        destination: '/products/kids/:id',
      },
    ];
  },
};

export default nextConfig;