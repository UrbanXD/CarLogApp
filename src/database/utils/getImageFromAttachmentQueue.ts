import { PhotoAttachmentQueue } from "../connector/powersync/PhotoAttachmentQueue.ts";
import { encode } from "base64-arraybuffer";
import { Image } from "../../types/zodTypes.ts";
import { getMediaType } from "./getFileExtension.ts";

type GetImageFromAttachmentQueueFunction = (
    attachmentQueue?: PhotoAttachmentQueue,
    path?: string | null
) => Promise<Image | null>;

export const getImageFromAttachmentQueue: GetImageFromAttachmentQueueFunction = async (attachmentQueue, path) => {
    if(attachmentQueue && path) {
        try {
            const file = await attachmentQueue.getFile(path);
            if(!file) return null;

            return {
                fileName: path,
                base64: encode(file),
                mediaType: getMediaType(path)
            };
        } catch(_) {
            return null;
        }
    }
    return null;
};