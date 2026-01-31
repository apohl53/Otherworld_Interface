import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const orderFile = path.join(uploadDir, "order.json");

    // 1️⃣ Read directory
    const files = await fs.readdir(uploadDir);

    // 2️⃣ Load saved order (if it exists)
    let orderMap = {};
    try {
      const orderRaw = await fs.readFile(orderFile, "utf-8");
      orderMap = JSON.parse(orderRaw);
    } catch {
      // No order.json yet — totally fine
    }

    // 3️⃣ Build file objects
    const fileObjects = files
      .filter(
        (name) =>
          name !== "order.json" &&
          !name.startsWith(".") // avoids .DS_Store, etc.
      )
      .map((filename) => ({
        filename,
        url: `/uploads/${filename}`,
        order: orderMap[filename] ?? Number.MAX_SAFE_INTEGER,
        isImage: /\.(png|jpe?g|gif|webp)$/i.test(filename),
        isVideo: /\.(mp4|mov|webm|avi)$/i.test(filename),
      }));

    // 4️⃣ Apply persisted order (🔥 critical fix)
    fileObjects.sort((a, b) => a.order - b.order);

    return Response.json({ files: fileObjects });
  } catch (error) {
    console.error("[v0] File list error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
