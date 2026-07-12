/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Photos are served from Supabase Storage's public CDN URLs; skip the
    // Next.js optimizer so no loader/domain config is needed.
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // Photo uploads reach `postTriangle` as a Server Action request. The
      // default body cap is 1 MB, which rejects any normal phone photo before
      // our own 8 MB check in lib/actions.ts can run. Allow the full 8 MB plus
      // multipart/form-data overhead so the app's validation is what enforces
      // the limit (with a friendly message) instead of a framework 413.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
