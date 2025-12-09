import fs from "fs/promises";
import path from "path";

const uploadDir = "C:/Users/Otherworld/TD_Application/PHL Box Office/Assets/Event Assets";

export async function GET(req, { params }) {
  try {
    const encoded = params.filepath.join("/");
    const relativePath = decodeURIComponent(encoded);
    const filePath = path.join(uploadDir, relativePath); 

    const ext = path.extname(filePath).toLowerCase();

    const mime = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
    }[ext] || "application/octet-stream";

    const data = await fs.readFile(filePath);

    return new Response(data, {
      status: 200,
      headers: { "Content-Type": mime }
    });

  } catch (error) {
    console.error("File serve error:", error);
    return new Response("File not found", { status: 404 });
  }
}

