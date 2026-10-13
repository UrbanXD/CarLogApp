import * as ImagePicker from "expo-image-picker";
import { getMediaType } from "../database/utils/getFileExtension.ts";
import { getUUID } from "../database/utils/uuid.ts";
import { Image } from "../types/zodTypes.ts";

export async function pickImage(
    type: "CAMERA" | "GALLERY",
    options?: ImagePicker.ImagePickerOptions & { directory?: string }
): Promise<Array<Image> | null> {
    try {
        const pickerResult = type === "CAMERA"
                             ? await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: !options?.allowsMultipleSelection,
                ...options
            })
                             : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: !options?.allowsMultipleSelection,
                ...options
            });

        if(pickerResult.canceled) return null;

        return pickerResult.assets.map(asset => {
            const fileExtension = asset.fileName?.match(/\.([a-z0-9]+)$/i)?.[1]
                ?? asset.mimeType?.split("/")[1]?.split("+")[0]
                ?? "jpg";
            const normalizedFileExtension = fileExtension.toLowerCase() === "jpeg" ? "jpg" : fileExtension;
            const fileName = `${ getUUID() }.${ normalizedFileExtension }`;

            return {
                uri: asset.uri,
                fileName,
                mediaType: asset.mimeType ?? getMediaType(fileName)
            } as Image;
        });
    } catch(error) {
        console.log("Pick image error:", error);
        return null;
    }
}
