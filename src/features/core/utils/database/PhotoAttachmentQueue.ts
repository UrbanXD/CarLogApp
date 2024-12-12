import * as FileSystem from 'expo-file-system';
import { BaseConfig } from './BaseConfig';
import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from '@powersync/attachments';
import { CARS_TABLE } from './AppSchema';
import { getUUID } from './uuid';

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {
    async init() {
        if (!BaseConfig.SUPABASE_CAR_IMAGES_BUCKET) {
            console.debug('No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches');
            // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
            this.options.syncInterval = 0;
            return;
        }

        await super.init();
    }

    onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
        this.powersync.watch(`SELECT image_id as id FROM ${CARS_TABLE} WHERE image_id IS NOT NULL`, [], {
            onResult: (result) => onUpdate(result.rows?._array.map((r) => r.id) ?? [])
        });
    }

    async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
        const photoId = record?.id ?? getUUID();
        const filename = record?.filename ?? `${photoId}.jpg`;
        return {
            id: photoId,
            filename,
            media_type: 'image/jpeg',
            state: AttachmentState.QUEUED_UPLOAD,
            ...record
        };
    }

    async savePhoto(base64Data: string): Promise<AttachmentRecord> {
        const photoAttachment = await this.newAttachmentRecord();
        photoAttachment.local_uri = this.getLocalFilePathSuffix(photoAttachment.filename);
        const localUri = this.getLocalUri(photoAttachment.local_uri);
        await this.storage.writeFile(localUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });

        console.log("savePhoto", localUri);

        const fileInfo = await FileSystem.getInfoAsync(localUri);
        console.log((await FileSystem.getInfoAsync("file:///data/user/0/com.urbanxd.Carlog/files//attachments/7e5393e9-57cb-4f45-a8fd-9f03ef8314d6.jpg")).exists)

        console.log(photoAttachment)
        if (fileInfo.exists) {
            photoAttachment.size = fileInfo.size;
        }

        return this.saveToQueue(photoAttachment);
    }
}