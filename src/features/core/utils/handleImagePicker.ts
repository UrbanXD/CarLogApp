import { askMediaLibraryPermission } from "./permissions"
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { uploadFiles } from "./database/tus";
import { Session } from "@supabase/supabase-js";
import { SupabaseConnector } from "./database/SupabaseConnector";
import { PhotoAttachmentQueue } from "./database/PhotoAttachmentQueue";
import { decode } from "base64-arraybuffer";

const getFileExtension = (uri: string) => {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match) {
        return match[1];
    }
    return "";
}

export const pickImage = async (supabaseConnector: SupabaseConnector, attachmentQueue?: PhotoAttachmentQueue, optionalPath: string = "", multipleSelect: boolean = false) => {
    await askMediaLibraryPermission("Szukesges permisson");

    const { userID } = await supabaseConnector.fetchCredentials();
    console.log(userID,  optionalPath)

    let pickerResult =
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: multipleSelect
        });

    if(!pickerResult.canceled) {
        const img = pickerResult.assets[0];
        const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: "base64" });
        optionalPath = `${optionalPath}${optionalPath != "" ? "/" : ""}`;
        const filePath = `${userID}/${optionalPath}${new Date().getTime()}.${getFileExtension(img.uri)}`;
        const contentType = img.mimeType;
        console.log(filePath, contentType);

        if(attachmentQueue) {
            await attachmentQueue.savePhoto(base64)
        }
        // await supabaseConnector.storage.uploadFile(filePath, decode(base64), {mediaType: contentType});

        return {
            base64,
            filePath,
            contentType
        }
    }

    return { }
}