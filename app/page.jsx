"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const fileInputRef = useRef(null);

  const fetchUploadedFiles = async () => {
    try {
      console.log("[v0] Fetching uploaded files...");
      const response = await fetch("/api/files");

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] API returned non-JSON response:", contentType);
        setUploadedFiles([]);
        return;
      }

      const data = await response.json();
      console.log("[v0] Received files data:", data);
      console.log("[v0] Number of files:", data.files?.length || 0);
      if (data.files && data.files.length > 0) {
        console.log("[v0] First file structure:", data.files[0]);
      }
      setUploadedFiles(data.files || []);
    } catch (error) {
      console.error("[v0] Error fetching files:", error);
      setUploadedFiles([]);
    }
  };

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file");
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setUploadedUrl(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Delete File
  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Move Files
  const reorderFiles = (fromIndex, toIndex) => {
    setUploadedFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Upload API returned non-JSON response");
        alert("Upload failed: Server returned an error");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUploadedUrl(data.url);
        alert(`File uploaded successfully!`);
        fetchUploadedFiles();
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("[v0] Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <main style={{ minHeight: "100vh", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Upload Your Media
          </h1>
          <p style={{ color: "#666" }}>
            Upload images or videos to get started
          </p>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "300px" }}>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "40px",
                backgroundColor: "white",
              }}
            >
              {!file ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  style={{
                    border: isDragging
                      ? "2px dashed #0066cc"
                      : "2px dashed #ccc",
                    borderRadius: "8px",
                    padding: "60px 20px",
                    textAlign: "center",
                    backgroundColor: isDragging ? "#f0f8ff" : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      handleFileChange(e.target.files?.[0] || null)
                    }
                    style={{ display: "none" }}
                    id="file-upload"
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#e6f2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>📤</span>
                    </div>

                    <div>
                      <p style={{ fontSize: "16px", marginBottom: "5px" }}>
                        Drop your file here, or{" "}
                        <label
                          htmlFor="file-upload"
                          style={{
                            color: "#0066cc",
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          browse
                        </label>
                      </p>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        Supports: Images (PNG, JPG, GIF) and Videos (MP4, MOV,
                        AVI)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "15px",
                      padding: "15px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        flex: "1",
                        minWidth: "0",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: "white",
                          borderRadius: "6px",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>
                          {isVideo ? "🎥" : "🖼️"}
                        </span>
                      </div>
                      <div style={{ flex: "1", minWidth: "0" }}>
                        <p
                          style={{
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </p>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearFile}
                      style={{
                        padding: "8px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      marginBottom: "20px",
                    }}
                  >
                    {isVideo ? (
                      <video
                        src={preview || undefined}
                        controls
                        style={{
                          width: "100%",
                          maxHeight: "400px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <img
                        src={preview || undefined}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "400px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>

                  {uploadedUrl && (
                    <div
                      style={{
                        padding: "15px",
                        backgroundColor: "#e8f5e9",
                        borderRadius: "6px",
                        marginBottom: "20px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginBottom: "5px",
                        }}
                      >
                        File uploaded successfully!
                      </p>
                      <p style={{ fontSize: "12px", color: "#666" }}>
                        File stored in memory (preview environment)
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={clearFile}
                      style={{
                        flex: "1",
                        padding: "12px",
                        border: "1px solid #ddd",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Upload Different File
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      style={{
                        flex: "1",
                        padding: "12px",
                        border: "none",
                        backgroundColor: uploading ? "#ccc" : "#0066cc",
                        color: "white",
                        borderRadius: "6px",
                        cursor: uploading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      {uploading
                        ? "Uploading..."
                        : uploadedUrl
                          ? "Uploaded ✓"
                          : "Upload File"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "300px" }}>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "white",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                }}
              >
                Uploaded Files
              </h2>

              {uploadedFiles.length === 0 ? (
                <p
                  style={{
                    color: "#666",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No files uploaded yet
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {uploadedFiles.map((fileItem, index) => {
                    console.log(
                      "[v0] Rendering file item:",
                      fileItem.fileName,
                      fileItem,
                    );
                    return (
                      <div
                        key={fileItem.filename}
                        draggable
                        onDragStart={() => setDragIndex(index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          reorderFiles(dragIndex, index);
                          setDragIndex(null);
                        }}
                        style={{
                          border:
                            dragIndex === index
                              ? "2px dashed #0066cc"
                              : "1px solid #e0e0e0",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#fafafa",
                          cursor: "grab",
                          opacity: dragIndex === index ? 0.5 : 1,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "120px",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          {fileItem.isImage ? (
                            <img
                              src={fileItem.url || "/placeholder.svg"}
                              alt={fileItem.filename}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : fileItem.isVideo ? (
                            <video
                              src={fileItem.url}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: "32px" }}>📄</span>
                          )}
                        </div>
                        <div style={{ padding: "8px" }}>
                          <p
                            style={{
                              fontSize: "12px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              margin: 0,
                            }}
                          >
                            {fileItem.filename}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
