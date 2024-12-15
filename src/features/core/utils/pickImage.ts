import { askMediaLibraryPermission } from "./getPermissions"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { getFileExtension } from "./getFileExtension";
import { getUUID } from "./uuid";
import { AttachmentRecord } from "@powersync/attachments";

export interface ImageType {
    id: string
    buffer: ArrayBuffer
    fileExtension: string
    mediaType: string
}

export const pickImage = async (options?: ImagePicker.ImagePickerOptions) => {
    await askMediaLibraryPermission("Szukesges permisson");

    let pickerResult =
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            ...options
        });

    if(!pickerResult.canceled) {
        const img = pickerResult.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, {encoding: "base64"});
        const fileExtension = getFileExtension(img.uri);

        return {
            id: getUUID(),
            buffer: decode(base64),
            fileExtension: fileExtension === "jpeg" ? "jpg" : fileExtension,
            mediaType: img.mimeType ?? "image/jpeg"
        }
    }

    return null
}