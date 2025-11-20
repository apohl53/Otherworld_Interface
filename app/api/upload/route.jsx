// import { addFile } from "../../../lib/file-store";

// const fileStore = [];

export function addFile(file) {
  fileStore.push(file);
}

export function getFiles() {
  return fileStore;
}

export const dynamic = "force-dynamic";

export async function POST(request) {
  console.log("[v0] Upload API route hit");

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("[v0] File received:", file.name, file.size);

    // Convert file to base64 data URL for in-memory storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;

    const fileData = {
      name: filename,
      url: dataUrl,
      displayName: file.name,
      size: file.size,
      type: file.type,
      isImage: file.type.startsWith("image/"),
      isVideo: file.type.startsWith("video/"),
      timestamp,
    };

    addFile(fileData);
    console.log("[v0] File stored in memory:", filename);

    return Response.json({
      success: true,
      url: dataUrl,
      filename,
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
