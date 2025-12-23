import { SupabaseClient } from "@supabase/supabase-js";
import { Directory, File, Paths } from "expo-file-system";
import { BaseConfig } from "../../../constants/index.ts";
import { EncodingType, StorageAdapter } from "@powersync/attachments";
import { FileWriteOptions } from "expo-file-system/build/ExpoFileSystem.types";

export type SupabaseStorageAdapterOptions = {
    client: SupabaseClient
}

export class SupabaseStorageAdapter implements StorageAdapter {
    constructor(private options: SupabaseStorageAdapterOptions) {}

    async uploadFile(
        filename: string,
        data: ArrayBuffer,
        options?: {
            mediaType?: string;
        }
    ): Promise<void> {
        if(!BaseConfig.SUPABASE_BUCKET) {
            throw new Error("Supabase bucket not configured in AppConfig.ts");
        }

        const { mediaType = "text/plain" } = options ?? {};

        const res =
            await this.options.client.storage
            .from(BaseConfig.SUPABASE_BUCKET)
            .upload(filename, data, { contentType: mediaType });

        if(res.error) throw res.error;
    }

    async downloadFile(filePath: string) {
        if(!BaseConfig.SUPABASE_BUCKET) {
            throw new Error("Supabase bucket not configured in AppConfig.ts");
        }

        const { data, error } =
            await this.options.client.storage
            .from(BaseConfig.SUPABASE_BUCKET)
            .download(filePath);

        if(error) throw error;

        return data as Blob;
    }

    async writeFile(
        fileURI: string,
        data: string | Uint8Array,
        options?: FileWriteOptions
    ): Promise<void> {
        const { encoding = EncodingType.UTF8 } = options ?? {};

        const file = new File(fileURI);
        await file.create({ intermediates: true, overwrite: true });
        await file.write(data, { encoding });
    }

    async readFile(fileURI: string): Promise<ArrayBuffer> {
        const file = new File(fileURI);
        if(!file.exists) throw new Error(`File does not exist: ${ fileURI }`);
        return file.arrayBuffer();
    }

    async deleteFile(fileURI: string, options?: { filename?: string }): Promise<void> {
        const file = new File(fileURI);
        if(file.exists) file.delete();

        const { filename } = options ?? {};
        if(!filename) return;

        if(!BaseConfig.SUPABASE_BUCKET) {
            throw new Error("Supabase bucket not configured in AppConfig.ts");
        }

        const { error } = await this.options.client.storage.from(BaseConfig.SUPABASE_BUCKET).remove([filename]);
        if(error) throw error;
    }

    async fileExists(fileURI: string): Promise<boolean> {
        return new File(fileURI).exists;
    }

    async makeDir(uri: string): Promise<void> {
        const directory = new Directory(uri);
        if(!directory.exists) directory.create({ intermediates: true });
    }

    async copyFile(sourceUri: string, targetUri: string): Promise<void> {
        const file = new File(sourceUri);
        const copiedFile = new File(targetUri);
        if(file.exists) file.copy(copiedFile);
    }

    getUserStorageDirectory(): string {
        return Paths.document.uri;
    }
}