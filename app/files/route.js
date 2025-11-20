import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check if we're in a browser-compatible environment
    if (typeof window !== "undefined") {
      return NextResponse.json({ files: [] });
    }

    // Try to use fs only on Node.js runtime
    const { readdir } = await import("fs/promises");
    const { join } = await import("path");

    const uploadDir = join(process.cwd(), "public", "uploads");

    let files;
    try {
      files = await readdir(uploadDir);
    } catch (error) {
      // Directory doesn't exist yet or can't be read
      console.log("Upload directory not found or empty:", error.message);
      return NextResponse.json({ files: [] });
    }

    // Filter out system files and map to file info
    const fileList = files
      .filter((file) => !file.startsWith("."))
      .map((filename) => ({
        name: filename,
        url: `/uploads/${filename}`,
        // Extract original name (remove timestamp prefix)
        displayName: filename.replace(/^\d+-/, ""),
        // Determine if it's an image or video based on extension
        isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(filename),
        isVideo: /\.(mp4|mov|avi|webm)$/i.test(filename),
      }))
      .reverse(); // Show newest first

    return NextResponse.json({ files: fileList });
  } catch (error) {
    console.error("Error listing files:", error);
    // Return empty array instead of error to prevent JSON parse issues
    return NextResponse.json({ files: [], error: error.message });
  }
}
