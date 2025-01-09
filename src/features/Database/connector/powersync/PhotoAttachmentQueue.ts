import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from '@powersync/attachments';
import * as FileSystem from 'expo-file-system';
import { BaseConfig } from '../BaseConfig';
import { CAR_TABLE } from './AppSchema';
import { getUUID } from '../../utils/uuid';
import { ImageType } from '../../../Shared/utils/pickImage';
import { encode } from 'base64-arraybuffer';

export class PhotoAttachmentQueue extends AbstractAttachmentQueue {

    async init() {
        if (!BaseConfig.SUPABASE_BUCKET) {
            console.debug('No Supabase bucket configured, skip setting up PhotoAttachmentQueue watches');
            // Disable sync interval to prevent errors from trying to sync to a non-existent bucket
            this.options.syncInterval = 0;
            return;
        }
        // this.options.syncInterval = 300; //30mp = 30000
        await super.init();
    }

    // async downloadRecord(record: AttachmentRecord) {
    //     console.log('ads')
    //     this.downloadRecord(record)
    //     return true;
    // }

    onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
        console.log(this.table, "taxxx")
        const imgSQL =
                `SELECT image as image FROM ${CAR_TABLE} WHERE image IS NOT NULL`;
        // UNION-nal lehet meg tobb tablat hozza irni es onnan is kiszedni ha lesz

        // this.powersync.watch("SELECT * FROM attachments", [], {
        //     onResult: async (result) => {
        //         console.log(result.rows?._array, "kutya");
        //     }
        // })

        this.powersync.watch(imgSQL, [], {
            onResult:
                async (result) => {
                    return onUpdate(
                    result.rows?._array.map(
                            (r) => {
                                // const file = r.image.substring(r.image.lastIndexOf('/') + 1, r.image.length);
                                // const extension = getFileExtension(r.image);
                                //
                                // const id = file.substring(0, file.length - 1 - extension.length)
                                // console.log("cica ", id)
                                return r.image;
                            }
                        )
                        ?? []
                    )}
        });
    }

    async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
        const fileID = getUUID();

        return {
            id: record?.id || `${fileID}.jpg`,
            filename: record?.id || `${fileID}.jpg`,
            media_type: "image/jpeg",
            state: AttachmentState.QUEUED_SYNC,
            ...record,
            local_uri: this.getLocalFilePathSuffix(record?.id || `${fileID}.jpg`),
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

        const attachmentRecord = await this.newAttachmentRecord({
            id: filename,
            media_type: image.mediaType,
            state: AttachmentState.QUEUED_UPLOAD,
        });

        const localURI = this.getLocalUri(attachmentRecord.local_uri || this.getLocalFilePathSuffix(filename));
        await this.storage.writeFile(localURI, encode(image.buffer), { encoding: FileSystem.EncodingType.Base64 });

        const fileInfo = await FileSystem.getInfoAsync(localURI);
        if (fileInfo.exists) {
            attachmentRecord.size = fileInfo.size;
        }

        return this.saveToQueue(attachmentRecord);
    }

    async getFile(filename: string): Promise<ArrayBuffer | null> {
        const localURI = `${this.storageDirectory}/${filename}`;

        let attachmentRecord = await this.record(filename);
        if (!attachmentRecord) {
            attachmentRecord = await this.newAttachmentRecord({
                id: filename,
                state: AttachmentState.QUEUED_DOWNLOAD,
            })

            await this.saveToQueue(attachmentRecord);
        }

        const { exists } = await FileSystem.getInfoAsync(localURI);
        if(!exists) {
            const directoryPath = localURI.substring(0, localURI.lastIndexOf('/') + 1);
            if(!await this.storage.fileExists(directoryPath)){
                await this.storage.makeDir(directoryPath);
            }

            return null;
        }

        return await this.storage.readFile(localURI, { encoding: FileSystem.EncodingType.Base64 });
    }
}