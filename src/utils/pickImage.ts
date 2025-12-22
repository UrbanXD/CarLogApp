import { askCameraPermission, askMediaLibraryPermission } from "./getPermissions.ts";
import * as ImagePicker from "expo-image-picker";
import { File } from "expo-file-system";
import { getFileExtension } from "../database/utils/getFileExtension.ts";
import { getUUID } from "../database/utils/uuid.ts";
import { Image } from "../types/zodTypes.ts";

export async function pickImage(
    type: "CAMERA" | "GALLERY",
    options?: ImagePicker.ImagePickerOptions
): Promise<Array<Image> | null> {
    await askMediaLibraryPermission("Szukesges permisson");
    await askCameraPermission("szuksees camera permisson");

    let pickerResult =
        type === "CAMERA"
        ?
        await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: !options?.allowsMultipleSelection,
            ...options
        })
        :
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: !options?.allowsMultipleSelection,
            ...options
        });


    if(!pickerResult.canceled) {
        const assets = pickerResult.assets;

        const images: Array<Image> = await Promise.all(
            assets.map(async (img) => {
                const base64 = await new File(img.uri).base64();
                const fileExtension = getFileExtension(img.uri);

                return {
                    fileName: `${ getUUID() }.${ fileExtension === "jpeg" ? "jpg" : fileExtension }`,
                    base64,
                    mediaType: img.mimeType ?? null
                } as Image;
            })
        );

        if(images.length > 0) return images;
    }

    return null;
};