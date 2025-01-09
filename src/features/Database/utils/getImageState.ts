import { encode } from "base64-arraybuffer";

const getImageState = (path?: string, buffer?: ArrayBuffer) => {
    if(!path || !buffer) return null;

    return {
        path,
        image: encode(buffer)
    }
}

export default getImageState;