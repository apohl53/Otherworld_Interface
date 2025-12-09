import fs from "fs/promises";
import path from "path";

const uploadDir = "C:/Users/Otherworld/TD_Application/PHL Box Office/Assets/Event Assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file"); // field name from frontend form

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = file.name;

    // Ensure uploadDir exists
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return new Response(JSON.stringify({ success: true, filename, url: `/api/files/${encodeURIComponent(filename)}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("File upload error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
