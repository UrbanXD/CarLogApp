import { getFileExtension, getFileName } from "./getFileExtension.ts";
import { decode } from "base64-arraybuffer";
import { ImageType } from "../../Form/utils/pickImage.ts";

const getFile = (path?: string, buffer?: string): ImageType | null => {
    if(!path || !buffer) return null;

    return {
        id: getFileName(path),
        fileExtension: getFileExtension(path),
        mediaType: "image/jpeg",  /// getMediaType
        buffer: decode(buffer)
    }
}

export default getFile;