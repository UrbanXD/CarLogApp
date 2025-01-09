export const getFileExtension = (path?: string) => {
    if(!path) return "";

    const fileName = path.split('/').pop() || path;
    return fileName.substring(fileName.lastIndexOf('.') + 1) || "jpg";
}

export const getFileName = (path?: string) => {
    if(!path) return "";

    const fileName = path.split('/').pop() || path;
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
}