export const getFileExtension = (path?: string) => {
    if(!path) return "";

    const match = /\.([a-zA-Z]+)$/.exec(path);
    if (match) {
        return match[1];
    }
    return "";
}

export const getFileName = (path?: string) => {
    if(!path) return "";

    const match = /\.([a-zA-Z]+)$/.exec(path);
    if (match) {
        return match[0];
    }
    return "";
}