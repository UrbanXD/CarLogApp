import { PhotoAttachmentQueue } from "../connector/powersync/PhotoAttachmentQueue.ts";
import { encode } from "base64-arraybuffer";
import {ImageType} from "../../features/user/model/types/user.ts";

type GetImageFromAttachmentQueueFunction = (attachmentQueue?: PhotoAttachmentQueue, path?: string | null) => Promise<ImageType | null>;

export const getImageFromAttachmentQueue: GetImageFromAttachmentQueueFunction = async (attachmentQueue, path) => {
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