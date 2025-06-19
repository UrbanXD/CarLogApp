import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema, DatabaseType } from "./powersync/AppSchema.ts";
import { SupabaseConnector } from "./SupabaseConnector.ts";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { Context, createContext, useContext } from "react";
import { SupabaseStorageAdapter } from "./storage/SupabaseStorageAdapter.ts";
import { PhotoAttachmentQueue } from "./powersync/PhotoAttachmentQueue.ts";
import { AttachmentRecord } from "@powersync/attachments";
import { UserDAO } from "../../features/user/model/dao/UserDAO.ts";
import { CarDAO } from "../../features/car/model/dao/CarDAO.ts";
import { BaseConfig } from "../../constants/baseConfig.ts";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    storage: SupabaseStorageAdapter;
    attachmentQueue?: PhotoAttachmentQueue;
    private _userDAO?: UserDAO;
    private _carDAO?: CarDAO;

    constructor() {
        this.powersync = new PowerSyncDatabase({
            schema: AppSchema,
            database: {
                dbFilename: "powersync-carlog.sqlite"
            }
        });
        this.db = wrapPowerSyncWithKysely(this.powersync);
        this.supabaseConnector = new SupabaseConnector(this.powersync);
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
                    console.log("attachment upload hiba", exception)
                    return { retry: false };
                }
            });
        }
    }

    get userDAO(): UserDAO {
        if (!this._userDAO) {
            this._userDAO = new UserDAO(this);
        }
        return this._userDAO;
    }

    get carDAO(): CarDAO {
        if (!this._carDAO) {
            this._carDAO = new CarDAO(this.db);
        }
        return this._carDAO;
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