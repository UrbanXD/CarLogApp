import { PhotoAttachmentQueue } from "../connector/powersync/PhotoAttachmentQueue.ts";
import { encode } from "base64-arraybuffer";
import { Image } from "../../types/index.ts";

type GetImageFromAttachmentQueueFunction = (
    attachmentQueue?: PhotoAttachmentQueue,
    path?: string | null
) => Promise<Image | null>;

export const getImageFromAttachmentQueue: GetImageFromAttachmentQueueFunction = async (attachmentQueue, path) => {
    if(attachmentQueue && path) {
        try {
            const file = await attachmentQueue.getFile(path);
            if(!file) return null;

            return { path, image: encode(file) };
        } catch(_) {
            return null;
        }
    }
    return null;
};