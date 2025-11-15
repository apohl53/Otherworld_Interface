"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isVideo = file?.type.startsWith("video/");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>
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
                border: isDragging ? "2px dashed #0066cc" : "2px dashed #ccc",
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
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
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
                    Supports: Images (PNG, JPG, GIF) and Videos (MP4, MOV, AVI)
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
                  style={{
                    flex: "1",
                    padding: "12px",
                    border: "none",
                    backgroundColor: "#0066cc",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Process File
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
