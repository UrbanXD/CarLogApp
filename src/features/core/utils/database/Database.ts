import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema, DatabaseType } from "./AppSchema";
import { SupabaseConnector } from "./SupabaseConnector";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { Context, createContext, useContext } from "react";
import { KVStorage } from "./KVStorage";
import { SupabaseStorageAdapter } from "./SupabaseStorageAdapter";
import { BaseConfig } from "./BaseConfig";
import { PhotoAttachmentQueue } from "./PhotoAttachmentQueue";
import { AttachmentRecord } from "@powersync/attachments";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    kvStorage: KVStorage;
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
        this.kvStorage = new KVStorage();
        this.supabaseConnector = new SupabaseConnector(this.kvStorage);
        this.storage = this.supabaseConnector.storage;

        if(BaseConfig.SUPABASE_CAR_IMAGES_BUCKET){
            this.attachmentQueue = new PhotoAttachmentQueue({
                powersync: this.powersync,
                storage: this.storage,
                onDownloadError: async (attachment: AttachmentRecord, exception: any) => {
                    if (exception.toString() === 'StorageApiError: Object not found') {
                        return { retry: false };
                    }

                    return { retry: true };
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

    async disconnect() {
        await this.powersync.disconnectAndClear();
    }
}

const database = new Database();
export const DatabaseContext = createContext(database);
export const useDatabase = () => useContext<Database>(DatabaseContext as Context<Database>);