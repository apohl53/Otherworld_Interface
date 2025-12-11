import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recursive file walker
async function getAllFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const dirent of dirents) {
    const fullPath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

export async function GET(req) {
  try {
    const filePath = req.nextUrl.searchParams.get("path");

    // ---------------------------------------------
    // CASE 1: Serve the file (image/video)
    // ---------------------------------------------
    if (filePath) {
      const fileBuffer = await fs.readFile(filePath);

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".mkv": "video/x-matroska",
      };

      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new Response(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        },
      });
    }

    // ---------------------------------------------
    // CASE 2: No `path` → Return file list (original behavior)
    // ---------------------------------------------
    const uploadDir = "/Users/Otherworld/TD_Application/PHL Box Office/Assets/Event Assets";
    const allFilePaths = await getAllFiles(uploadDir);

    const files = allFilePaths.map(fullPath => {
      const name = path.basename(fullPath);
      const ext = path.extname(name).toLowerCase();

      const isImage = [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext);
      const isVideo = [".mp4", ".mov", ".avi", ".mkv"].includes(ext);

      return {
        filename: name,
        fullPath,
        url: `/api/files?path=${encodeURIComponent(fullPath)}`,
        imageUrl: isImage ? `/api/files?path=${encodeURIComponent(fullPath)}` : null,
        isImage,
        isVideo,
      };
    });

    return Response.json({ files });

  } catch (error) {
    console.error("Files API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const filePath = req.nextUrl.searchParams.get("path");

    if (!filePath) {
      return new Response("Missing file path", { status: 400 });
    }

    await fs.unlink(filePath); // DELETE the file

    return new Response("File deleted successfully", { status: 200 });
  } catch (error) {
    console.error("File delete error:", error);
    return new Response("Error deleting file", { status: 500 });
  }
}
