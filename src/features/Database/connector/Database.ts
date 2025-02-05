import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema, DatabaseType } from "./powersync/AppSchema";
import { SupabaseConnector } from "./SupabaseConnector";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { Context, createContext, useContext } from "react";
import LargeSecureStore from "./storage/LargeSecureStorage.ts";
import { SupabaseStorageAdapter } from "./storage/SupabaseStorageAdapter";
import { PhotoAttachmentQueue } from "./powersync/PhotoAttachmentQueue";
import { BaseConfig } from "./BaseConfig";
import { AttachmentRecord } from "@powersync/attachments";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    largeSecureStore: LargeSecureStore;
    storage: SupabaseStorageAdapter;
    attachmentQueue: PhotoAttachmentQueue | undefined = undefined;

    constructor() {
        this.powersync = new PowerSyncDatabase({
            schema: AppSchema,
            database: {
                dbFilename: "carlog-app.sqlite"
            }
        })
        this.db = wrapPowerSyncWithKysely(this.powersync);
        this.largeSecureStore = new LargeSecureStore();
        this.supabaseConnector = new SupabaseConnector(this.largeSecureStore, this.powersync);
        this.storage = this.supabaseConnector.storage;

        if(BaseConfig.SUPABASE_BUCKET){
            this.attachmentQueue = new PhotoAttachmentQueue({
                powersync: this.powersync,
                storage: this.storage,
                onDownloadError: async (attachment: AttachmentRecord, exception: any) => {
                    if (exception.toString() === 'StorageApiError: Object not found') {
                        return { retry: false };
                    }

                    return { retry: true };
                },
                onUploadError: async (attachment: AttachmentRecord, exception: any) => {
                    console.log("upload hiba",exception)
                    return { retry: false };
                }
            });
        }
    }

    async init() {
        await this.powersync.init();
        await this.powersync.connect(this.supabaseConnector);

        if(this.attachmentQueue){
            await this.attachmentQueue.init();
        }
    }
}

const database = new Database();
export const DatabaseContext = createContext(database);
export const useDatabase = () => useContext<Database>(DatabaseContext as Context<Database>);