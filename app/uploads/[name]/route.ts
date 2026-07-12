import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOADS_DIR } from "@/lib/db";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Serve uploaded photos (and seeded demo images) from the data directory. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  // Filenames are UUIDs/seed ids we generated; reject anything else.
  if (!/^[a-zA-Z0-9_-]+\.[a-z0-9]+$/.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  const type = CONTENT_TYPES[path.extname(name).toLowerCase()];
  const file = path.join(UPLOADS_DIR, name);
  if (!type || !existsSync(file)) {
    return new Response("Not found", { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(file)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(statSync(file).size),
      // Filenames are content-unique (UUIDs), safe to cache hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
