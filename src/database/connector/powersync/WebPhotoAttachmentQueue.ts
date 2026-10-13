import { BaseConfig } from "../../../constants/index.ts";
import { Image } from "../../../types/zodTypes.ts";
import { SupabaseStorageAdapter } from "../storage/SupabaseStorageAdapter.ts";

/** Direct browser upload path. The native queue copies files to its local attachment store. */
export class WebPhotoAttachmentQueue {
    constructor(private readonly storage: SupabaseStorageAdapter) {}

    async init(): Promise<void> {}

    getLocalFilePathSuffix(filename?: string): string {
        return filename ?? "";
    }

    getLocalUri(filename: string): string {
        return filename;
    }

    async changeEntityAttachment(
        image: Image | null,
        previousFilePath: string | null,
        storagePath?: string
    ): Promise<string | null> {
        if(!BaseConfig.SUPABASE_ATTACHMENT_BUCKET) {
            throw new Error("Supabase bucket not configured in AppConfig.ts");
        }

        if(!image) {
            if(previousFilePath) await this.deleteFile(previousFilePath);
            return null;
        }

        const path = this.getPathWithStoragePath(image.fileName, storagePath);
        if(previousFilePath === path) return previousFilePath;

        const response = await fetch(image.uri);
        if(!response.ok) {
            throw new Error(`Could not read selected image for upload (${ response.status })`);
        }

        await this.storage.uploadFile(path, await response.arrayBuffer(), {
            mediaType: image.mediaType ?? undefined
        });

        if(previousFilePath) await this.deleteFile(previousFilePath);

        return path;
    }

    async deleteFile(path: string): Promise<void> {
        await this.storage.deleteRemoteFile(path);
    }

    async cleanUpLocalFiles(): Promise<void> {}

    private getPathWithStoragePath(filePath: string, storagePath?: string): string {
        if(!storagePath || filePath.startsWith(`${ storagePath }/`)) return filePath;

        return `${ storagePath }/${ filePath }`;
    }
}
