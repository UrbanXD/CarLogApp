import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";
import { getFileExtension, getMediaType } from "../database/utils/getFileExtension.ts";
import { getUUID } from "../database/utils/uuid.ts";
import { Image } from "../types/zodTypes.ts";

export async function pickImage(
    type: "CAMERA" | "GALLERY",
    options?: ImagePicker.ImagePickerOptions & { directory?: string }
): Promise<Array<Image> | null> {
    try {
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
            const directory = new Directory(options?.directory ?? Paths.cache);
            if(!directory.exists) directory.create();

            const images: Array<Image> = await Promise.all(
                assets.map(async (img) => {
                    const fileExtension = getFileExtension(img.uri);
                    const newFileName = `${ getUUID() }.${ fileExtension }`;

                    const file = new File(img.uri);
                    const copiedFile = new File(directory.uri, newFileName);
                    file.copy(copiedFile);

                    return {
                        uri: copiedFile.uri,
                        fileName: newFileName,
                        mediaType: img.mimeType ?? getMediaType(copiedFile)
                    } as Image;
                })
            );

            if(images.length > 0) return images;
        }
    } catch(e) {
        console.log("Pick image error:", e);
        return null;
    }

    return null;
}