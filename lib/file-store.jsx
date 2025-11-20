// This stores files as base64 data URLs in memory
// Replace with real file storage (Vercel Blob, filesystem, etc.) when deploying

const fileStore = [];

export function addFile(file) {
  fileStore.push(file);
}

export function getFiles() {
  return fileStore;
}
