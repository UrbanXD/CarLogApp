import { askMediaLibraryPermission } from "./getPermissions"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

const getFileExtension = (uri: string) => {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match) {
        return match[1];
    }
    return "";
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
        const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: "base64" });

        return decode(base64);
    }

    return null
}