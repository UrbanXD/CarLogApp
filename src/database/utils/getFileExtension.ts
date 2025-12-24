export function getFileExtension(path?: string) {
    if(!path) return "";

    const fileName = path.split("/").pop() || path;
    return fileName.substring(fileName.lastIndexOf(".") + 1) || "jpg";
}

export function getFileName(path?: string) {
    if(!path) return "";

    const fileName = path.split("/").pop() || path;
    return fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
}

const mimeTypes: Record<string, string> = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "svg": "image/svg+xml",
    "webp": "image/webp",
    "mp4": "video/mp4",
    "webm": "video/webm",
    "pdf": "application/pdf",
    "json": "application/json"
};

export function getMediaType(path?: string) {
    if(!path) return null;

    const extension = getFileExtension(path).toLowerCase();
    return mimeTypes?.[extension] ?? "application/octet-stream";
}