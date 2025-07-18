import { encode } from "base64-arraybuffer";
import { Image } from "../../types/index.ts";

const getImageState = (path?: string, buffer?: ArrayBuffer): Image => {
    if(!path || !buffer) return null;

    return {
        path,
        image: encode(buffer)
    };
};

export default getImageState;