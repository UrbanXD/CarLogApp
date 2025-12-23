import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from "@powersync/attachments";
import * as FileSystem from "expo-file-system/legacy";
import { BaseConfig } from "../../../constants/index.ts";
import { getUUID } from "../../utils/uuid.ts";
import { USER_TABLE } from "./tables/user.ts";
import { CAR_TABLE } from "./tables/car.ts";
import { Image } from "../../../types/zodTypes.ts";

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
    async init() {
        if(!BaseConfig.SUPABASE_BUCKET) {
            console.debug("No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches");
            // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
            this.options.syncInterval = 0;
            return;
        }
        await super.init();
    }

    onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
        const imgSQL = `
            SELECT image as image
            FROM ${ CAR_TABLE }
            WHERE image IS NOT NULL
            UNION ALL
            SELECT avatar_url as image
            FROM ${ USER_TABLE }
            WHERE avatarImage IS NOT NULL
        `;

        this.powersync.watch(imgSQL, [], {
            onResult:
                async (result) => {
                    return onUpdate(
                        result.rows?._array.map(
                            (r) => r.image
                        ) ?? []
                    );
                }
        });
    }

    async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
        const fileID = getUUID();

        return {
            id: record?.id || `${ fileID }.jpg`,
            filename: record?.id || `${ fileID }.jpg`,
            media_type: "image/jpeg",
            state: AttachmentState.QUEUED_SYNC,
            ...record,
            local_uri: this.getLocalFilePathSuffix(record?.id || `${ fileID }.jpg`)
        };
    }

    getPathWithStoragePath(filePath: string, storagePath?: string): string {
        return storagePath && !filePath.startsWith(storagePath)
               ? storagePath[storagePath.length - 1] !== "/"
                 ? `${ storagePath }/${ filePath }`
                 : `${ storagePath }${ filePath }`
               : filePath;
    }

    async saveFile(image: Image, storagePath?: string): Promise<AttachmentRecord> {
        const path = this.getPathWithStoragePath(image.fileName, storagePath);

        const attachmentRecord = await this.newAttachmentRecord({
            id: path,
            media_type: image.mediaType,
            state: AttachmentState.QUEUED_UPLOAD
        });

        const localURI = this.getLocalUri(attachmentRecord.local_uri || this.getLocalFilePathSuffix(path));
        await this.storage.writeFile(localURI, image.base64, { encoding: FileSystem.EncodingType.Base64 });

        const fileInfo = await FileSystem.getInfoAsync(localURI);
        if(fileInfo.exists) attachmentRecord.size = fileInfo.size;

        return this.saveToQueue(attachmentRecord);
    }

    async getFile(filename: string): Promise<ArrayBuffer | null> {
        const localURI = `${ this.storageDirectory }/${ filename }`;

        let attachmentRecord = await this.record(filename);
        if(!attachmentRecord) {
            attachmentRecord = await this.newAttachmentRecord({
                id: filename,
                state: AttachmentState.QUEUED_DOWNLOAD
            });

            await this.saveToQueue(attachmentRecord);
        }

        return await this.storage.readFile(localURI, { encoding: FileSystem.EncodingType.Base64 });
    }

    async deleteFile(path: string): Promise<void> {
        const localURI = this.getLocalUri(this.getLocalFilePathSuffix(path));
        await this.storage.deleteFile(localURI, { filename: path });
    }
}