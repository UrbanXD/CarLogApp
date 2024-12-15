import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from '@powersync/attachments';
import * as FileSystem from 'expo-file-system';
import { BaseConfig } from '../BaseConfig';
import { CAR_TABLE } from './AppSchema';
import { getUUID } from '../../uuid';
import { ImageType } from '../../pickImage';
import { encode } from 'base64-arraybuffer';
import { getFileExtension } from '../../getFileExtension';

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
    async init() {
        if (!BaseConfig.SUPABASE_BUCKET) {
            console.debug('No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches');
            // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
            this.options.syncInterval = 0;
            return;
        }
        this.options.syncInterval = 30000; //30mp = 30000

        await super.init();
    }

    onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
        const imgSQL =
                `SELECT image as image FROM ${CAR_TABLE} WHERE image IS NOT NULL`;
        // UNION-nal lehet meg tobb tablat hozza irni es onnan is kiszedni ha lesz

        this.powersync.watch(imgSQL, [], {
            onResult:
                async (result) => {
                    return onUpdate(
                    result.rows?._array.map(
                            (r) => {
                                const file = r.image.substring(r.image.lastIndexOf('/') + 1, r.image.length);
                                const extension = getFileExtension(r.image);

                                return file.substring(0, file.length - 1 - extension.length);
                            }
                        )
                        ?? []
                    )}
        });
    }


    async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
        const fileID = record?.id ?? getUUID();

        return {
            id: fileID,
            filename: record?.filename ?? `${fileID}.jpg`,
            media_type: record?.media_type ?? "image/jpeg",
            state: AttachmentState.QUEUED_UPLOAD,
            ...record
        };
    }

    async saveFile(image: ImageType, storagePath?: string): Promise<AttachmentRecord> {
        storagePath =
            storagePath
                ? storagePath[storagePath.length-1] !== "/"
                    ? `${storagePath}/`
                    : storagePath
                : "";
        const filename = `${storagePath}${image.id}.${image.fileExtension}`;

        const attachmentRecord: AttachmentRecord = {
            id: image.id,
            filename: filename,
            media_type: image.mediaType,
            state: AttachmentState.QUEUED_UPLOAD
        };

        attachmentRecord.local_uri = this.getLocalFilePathSuffix(attachmentRecord.filename);
        const localURI = `${this.storageDirectory}/${filename}`;
        await this.storage.writeFile(localURI, encode(image.buffer), { encoding: FileSystem.EncodingType.Base64 });

        const fileInfo = await FileSystem.getInfoAsync(localURI);
        if (fileInfo.exists) {
            attachmentRecord.size = fileInfo.size;
        }

        return this.saveToQueue(attachmentRecord);
    }

    async getFile(filename: string): Promise<ArrayBuffer | null> {
        const localURI = `${this.storageDirectory}/${filename}`;
        const { exists } = await FileSystem.getInfoAsync(localURI);

        if(!exists) {
            return null;
        }

        return await this.storage.readFile(localURI, { encoding: FileSystem.EncodingType.Base64 });
    }
}