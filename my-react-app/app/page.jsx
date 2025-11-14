"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, FileVideo, FileImage } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    // Check if file is image or video
    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload an image or video file");
      return;
    }

    setFile(selectedFile);

    // Create preview URL
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
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Upload Your Media
          </h1>
          <p className="text-muted-foreground">
            Upload images or videos to get started
          </p>
        </div>

        <Card className="p-8">
          {!file ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />

              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>

                <div>
                  <p className="text-lg font-medium text-foreground mb-1">
                    Drop your file here, or{" "}
                    <label
                      htmlFor="file-upload"
                      className="text-primary cursor-pointer hover:underline"
                    >
                      browse
                    </label>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports: Images (PNG, JPG, GIF) and Videos (MP4, MOV, AVI)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="rounded-md bg-background p-2 shrink-0">
                    {isVideo ? (
                      <FileVideo className="w-5 h-5 text-primary" />
                    ) : (
                      <FileImage className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview */}
              <div className="rounded-lg overflow-hidden bg-muted">
                {isVideo ? (
                  <video
                    src={preview || undefined}
                    controls
                    className="w-full max-h-96 object-contain"
                  />
                ) : (
                  <img
                    src={preview || undefined}
                    alt="Preview"
                    className="w-full max-h-96 object-contain"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={clearFile}
                  variant="outline"
                  className="flex-1"
                >
                  Upload Different File
                </Button>
                <Button className="flex-1">Process File</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
