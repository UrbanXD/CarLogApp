export function getFileExtension(path?: string) {
    if(!path) return "";

    const fileName = path.split("/").pop() || path;
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1) ?? "jpg";
    return fileExtension === "jpeg" ? "jpg" : fileExtension;
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