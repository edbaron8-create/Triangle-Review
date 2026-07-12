/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Photo uploads go through a Server Action, whose request body defaults
    // to a 1 MB cap. lib/actions.ts allows photos up to 8 MB, so raise the
    // limit (with headroom for multipart overhead) or larger posts fail
    // before postTriangle() ever runs.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Photos are served from Supabase Storage's public CDN URLs; skip the
    // Next.js optimizer so no loader/domain config is needed.
    unoptimized: true,
  },
};

export default nextConfig;
