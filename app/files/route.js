export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { getFiles } from "@/lib/file-store";

export async function GET() {
  console.log("[v0] Files API route hit");

  try {
    const files = getFiles();
    console.log("[v0] Returning", files.length, "files from memory");

    return Response.json({
      files: files.slice().reverse(), // Return newest first
    });
  } catch (error) {
    console.error("[v0] Files API error:", error);
    return Response.json(
      {
        files: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}
