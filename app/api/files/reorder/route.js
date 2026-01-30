import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { orderedFilenames } = await req.json();

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const orderFile = path.join(uploadDir, "order.json");

    const orderMap = {};
    orderedFilenames.forEach((name, index) => {
      orderMap[name] = index;
    });

    await fs.writeFile(orderFile, JSON.stringify(orderMap, null, 2));

    return Response.json({ success: true });
  } catch (error) {
    console.error("[v0] Reorder error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
