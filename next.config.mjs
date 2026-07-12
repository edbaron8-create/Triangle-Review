/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Native module — must stay external to the server bundle.
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // Uploads are served straight from disk by app/uploads/[name]/route.ts;
    // skip the optimizer (it can't reach runtime-written files at build).
    unoptimized: true,
  },
};

export default nextConfig;
