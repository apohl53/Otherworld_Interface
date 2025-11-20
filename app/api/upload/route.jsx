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

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await stat(uploadDir);
    } catch (err) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);
    console.log("[v0] File saved to:", filepath);

    return Response.json({
      success: true,
      filename,
      path: `/uploads/${filename}`, // not public yet, but good for metadata
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
