// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // 👈 this enables SSR support
  },
  images: {
    domains: ['flagcdn.com'], // Add the domain here
  },
};

export default nextConfig;
