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

export async function GET() {
  try {
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
        url: `/api/files/${encodeURIComponent(fullPath)}`,
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


