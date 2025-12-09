"use client";

import { useEffect, useState } from "react";
import styles from "./ThumbnailGrid.module.css";

export default function ThumbnailGrid() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch the files from your API
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error("Failed to load files", err);
      }
    }

    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Event Assets</h2>

      <div className={styles.grid}>
        {files.map((file) => (
          <div
            key={file.url}
            className={styles.item}
            onClick={() => setSelectedFile(file)}
          >
            {file.isImage && (
              <img src={file.url} alt={file.filename} className={styles.thumbnail} />
            )}
            {file.isVideo && (
              <video
                src={file.url}
                className={styles.thumbnail}
                muted
                loop
                playsInline
              />
            )}
            <p className={styles.filename}>{file.filename}</p>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selectedFile && (
        <div className={styles.modal} onClick={() => setSelectedFile(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {selectedFile.isImage && (
              <img src={selectedFile.url} alt={selectedFile.filename} />
            )}
            {selectedFile.isVideo && (
              <video src={selectedFile.url} controls autoPlay />
            )}
            <p>{selectedFile.filename}</p>
          </div>
        </div>
      )}
    </div>
  );
}
