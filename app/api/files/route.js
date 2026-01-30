import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const orderFile = path.join(uploadDir, "order.json");

    const filenames = await fs.readdir(uploadDir);

    // Load saved order (if it exists)
    let orderMap = {};
    try {
      const orderData = await fs.readFile(orderFile, "utf-8");
      orderMap = JSON.parse(orderData);
    } catch {}

    const files = filenames
      .filter((name) => name !== "order.json")
      .map((name) => {
        const ext = path.extname(name).toLowerCase();

        const isImage = [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(
          ext,
        );
        const isVideo = [".mp4", ".mov", ".avi", ".mkv"].includes(ext);

        return {
          filename: name,
          url: `/uploads/${name}`,
          isImage,
          isVideo,
          order: orderMap[name] ?? 9999,
        };
      })
      .sort((a, b) => a.order - b.order);

    return Response.json({ files });
  } catch (error) {
    console.error("[v0] Files API error:", error);
    return Response.json({ files: [], error: error.message }, { status: 500 });
  }
}
