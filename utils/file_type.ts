function isMediaFile(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/") || file.type.startsWith("audio/");
}
function getFileType(file: File): "image" | "video" | "audio" | "font" | null {
  if (file.type.startsWith("image/")) {
    return "image";
  } else if (file.type.startsWith("video/")) {
    return "video";
  } else if (file.type.startsWith("audio/")) {
    return "audio";
  } else {
    return null;
  }
}
export {
  isMediaFile,
  getFileType
}