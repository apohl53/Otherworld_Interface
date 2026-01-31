import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { filename } = await req.json();

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);
    const orderFile = path.join(uploadDir, "order.json");

    // Delete the file
    await fs.unlink(filePath);

    // Update order.json if it exists
    try {
      const orderData = JSON.parse(await fs.readFile(orderFile, "utf-8"));
      delete orderData[filename];
      await fs.writeFile(orderFile, JSON.stringify(orderData, null, 2));
    } catch {
      // order.json doesn't exist — safe to ignore
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
