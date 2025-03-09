import { PhotoAttachmentQueue } from "../connector/powersync/PhotoAttachmentQueue.ts";
import { encode } from "base64-arraybuffer";

export const getImageFromAttachmentQueue = async (attachmentQueue?: PhotoAttachmentQueue, path?: string) => {
    if(attachmentQueue && path) {
        try {
            const file = await attachmentQueue.getFile(path);
            if(!file) return null;

            return { path, image: encode(file) }
        } catch (_) {
            return null;
        }
    }
    return null;
}