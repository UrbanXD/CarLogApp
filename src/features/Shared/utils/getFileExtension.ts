export const getFileExtension = (uri: string) => {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match) {
        return match[1];
    }
    return "";
}