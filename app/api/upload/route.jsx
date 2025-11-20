import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  console.log("[v0] API route hit");

  try {
    // Try to use fs only on Node.js runtime
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");

    const formData = await request.formData();
    console.log("[v0] FormData parsed");

    const file = formData.get("file");
    console.log("[v0] File from formData:", file?.name, file?.size);

    if (!file) {
      console.log("[v0] No file in request");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("[v0] File buffer created, size:", buffer.length);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    console.log("[v0] Upload directory:", uploadDir);
    await mkdir(uploadDir, { recursive: true });

    // Save file with timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadDir, filename);
    console.log("[v0] Saving to:", filepath);

    await writeFile(filepath, buffer);
    console.log("[v0] File saved successfully");

    // Return the public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("[v0] Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}
