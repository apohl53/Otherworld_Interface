import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filenames = await fs.readdir(uploadDir);

    const files = filenames.map((name) => ({
      name,
      path: `/uploads/${name}`,
    }));

    return Response.json({ files: files.reverse() }); // newest first
  } catch (error) {
    console.error("[v0] Files API error:", error);
    return Response.json({ files: [], error: error.message }, { status: 500 });
  }
}
