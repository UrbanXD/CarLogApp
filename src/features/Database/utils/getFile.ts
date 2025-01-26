import { getFileExtension, getFileName } from "./getFileExtension";
import { decode } from "base64-arraybuffer";

const getFile = (path?: string, buffer?: string) => {
    if(!path || !buffer) return null;

    return {
        id: getFileName(path),
        fileExtension: getFileExtension(path),
        mediaType: "image/jpeg",  /// getMediaType
        buffer: decode(buffer)
    }
}

export default getFile;