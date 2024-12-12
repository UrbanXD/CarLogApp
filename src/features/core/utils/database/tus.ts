import { Upload } from "tus-js-client";
import * as ImagePicker from "expo-image-picker";
import { BaseConfig } from "./BaseConfig";
import { useDatabase } from "./Database";
import { Session } from "@supabase/supabase-js";

const getFileExtension = (uri: string) => {
    const match = /\.([a-zA-Z]+)$/.exec(uri);
    if (match) {
        return match[1];
    }
    return "";
}

const getMimeType = (extension: string) => {
    if(extension === "jpg") return "image/jpeg";
    return `image/${extension}`;
}

export const uploadFiles = async (session: Session, bucketName: string, pickerResult: | ImagePicker.ImagePickerResult) => {
    if(pickerResult.assets == null){
        return;
    }

    const allUploads = pickerResult.assets.map(
        (file: ImagePicker.ImagePickerAsset) => {
            new Promise<void>(async (resolve, reject) => {
                const extension = getFileExtension(file.uri);
                const blob = await fetch(file.uri).then((res) => res.blob());

                let upload = new Upload(blob, {
                    endpoint: `${BaseConfig.SUPABASE_URL}/storage/v1/upload/resumable`,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    headers: {
                        authorization: `Bearer ${session?.access_token}`, //`Bearer ${BaseConfig.SUPABASE_ANON_KEY}`
                        'x-upsert': 'true' ///overwrite miatt
                    },
                    uploadDataDuringCreation: true,
                    removeFingerprintOnSuccess: true,
                    metadata: {
                        bucketName: bucketName,
                        objectName: file?.fileName ?? Date.now().toString(), //file?.name
                        contentType: getMimeType(extension),
                        cacheControl: "3600",
                    },
                    chunkSize: 6 * 1024 * 1024,
                    onError: (err) => {
                        console.log("Failed Upload Tus Image: ", err);
                    },
                    onProgress: (e) => {
                      console.log("Upload Tus Progress: ", e);
                    },
                    onSuccess: () => {
                        console.log("Upload Tus Image: ", upload.options.metadata?.objectName);
                        resolve();
                    }
                })

                return upload.findPreviousUploads().then((previousUploads) => {
                    if (previousUploads.length > 0) {
                        upload.resumeFromPreviousUpload(previousUploads[0]);
                    }

                    upload.start;
                });
            });
        }
    );

    await Promise.allSettled(allUploads);
    return;
}