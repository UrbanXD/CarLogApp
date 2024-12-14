import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from '@powersync/attachments';
import * as FileSystem from 'expo-file-system';
import { BaseConfig } from '../BaseConfig';
import { CARS_TABLE } from './AppSchema';
import { getUUID } from '../../uuid';
import { ImageType } from '../../pickImage';
import { encode } from 'base64-arraybuffer';

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
    async init() {
        if (!BaseConfig.SUPABASE_BUCKET) {
            console.debug('No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches');
            // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
            this.options.syncInterval = 0;
            return;
        }

        await super.init();
    }

    onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
        console.log("onAttachmentIdsChange");
        const imgSQL =
                `SELECT image as image FROM ${CARS_TABLE} WHERE image IS NOT NULL`;
        // UNION-nal lehet meg tobb tablat hozza irni es onnan is kiszedni ha lesz


        this.powersync.watch(imgSQL, [], {
            onResult:
                (result) =>
                    onUpdate(
                    result.rows?._array.map(
                            (r) => {
                                console.log(r, "A");
                                return r.image;
                            }
                        )
                        ?? []
                    )
        });
    }

    async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
        const fileID = record?.id ?? getUUID();
        const filename = record?.filename ?? `${fileID}.jpg`;

        return {
            id: fileID,
            filename,
            media_type: 'image/jpeg',
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
        const fileName = `${storagePath}${image.id}.${image.fileExtension}`;

        const attachmentRecord: AttachmentRecord = {
            id: image.id,
            filename: fileName,
            media_type: image.mediaType,
            state: AttachmentState.QUEUED_UPLOAD
        };

        attachmentRecord.local_uri = this.getLocalFilePathSuffix(attachmentRecord.filename);
        const localUri = this.getLocalUri(attachmentRecord.local_uri);
        console.log(localUri, "heo")
        await this.storage.writeFile(localUri, encode(image.buffer), { encoding: FileSystem.EncodingType.Base64 });

        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
           attachmentRecord.size = fileInfo.size;
        }

        return this.saveToQueue(attachmentRecord);
    }
}