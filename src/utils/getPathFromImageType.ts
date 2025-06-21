import { ImageType } from "./pickImage.ts";

export const getPathFromImageType = (image: ImageType | null, dir?: string) => {
    if(!image) return null;

    return `${ dir }/${ image.id }.${ image.fileExtension }`;
};