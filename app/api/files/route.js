import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filenames = await fs.readdir(uploadDir);

    const files = filenames.map((name) => {
      const ext = path.extname(name).toLowerCase();

      const isImage = [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
      const isVideo = [".mp4", ".mov", ".avi", ".mkv"].includes(ext);

      return {
        filename: name, // <-- what your UI uses
        url: `/uploads/${name}`, // <-- what your UI uses
        isImage,
        isVideo,
      };
    });

    return Response.json({ files: files.reverse() });
  } catch (error) {
    console.error("[v0] Files API error:", error);
    return Response.json({ files: [], error: error.message }, { status: 500 });
  }
}
