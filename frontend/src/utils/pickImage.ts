import { askMediaLibraryPermission } from "./getPermissions.ts";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { getFileExtension } from "../database/utils/getFileExtension.ts";
import { getUUID } from "../database/utils/uuid.ts";

export interface ImageType {
    id: string;
    buffer: ArrayBuffer;
    fileExtension: string;
    mediaType: string;
}

export const pickImage = async (options?: ImagePicker.ImagePickerOptions): Promise<Array<ImageType> | null> => {
    await askMediaLibraryPermission("Szukesges permisson");

    let pickerResult =
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: !options?.allowsMultipleSelection,
            ...options
        });


    if(!pickerResult.canceled) {
        const assets = pickerResult.assets;

        const images = await Promise.all(
            assets.map(async (img) => {
                const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: "base64" });
                const fileExtension = getFileExtension(img.uri);

                return {
                    id: getUUID(),
                    buffer: decode(base64),
                    fileExtension: fileExtension === "jpeg" ? "jpg" : fileExtension,
                    mediaType: img.mimeType ?? "image/jpeg"
                };
            })
        );

        if(images.length > 0) {
            return images;
        }
    }

    return null;
};