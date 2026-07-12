/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Photos are served from Supabase Storage's public CDN URLs; skip the
    // Next.js optimizer so no loader/domain config is needed.
    unoptimized: true,
  },
};

export default nextConfig;
