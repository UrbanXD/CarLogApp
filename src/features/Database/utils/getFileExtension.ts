export const getFileExtension = (path?: string) => {
    if(!path) return "";

    const fileName = path.split('/').pop() || "";
    return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
}

export const getFileName = (path?: string) => {
    if(!path) return "";

    const fileName = path.split('/').pop() || "";
    return fileName.substring(fileName.lastIndexOf('.') + 1) || "";
}