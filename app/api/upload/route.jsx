import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request) {
  console.log("[v0] Upload API route hit");

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save to public/uploads — must match your GET route
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    try {
      await stat(uploadDir);
    } catch (err) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const filename = file.name;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log("[v0] File saved to:", filepath);

    return Response.json({
      success: true,
      filename,
      path: `/uploads/${filename}`,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[v0] Upload error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Upload failed",
      },
      { status: 500 }
    );
  }
}
