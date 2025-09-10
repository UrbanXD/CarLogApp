import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema, DatabaseType } from "./powersync/AppSchema.ts";
import { SupabaseConnector } from "./SupabaseConnector.ts";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { SupabaseStorageAdapter } from "./storage/SupabaseStorageAdapter.ts";
import { PhotoAttachmentQueue } from "./powersync/PhotoAttachmentQueue.ts";
import { AttachmentRecord } from "@powersync/attachments";
import { UserDao } from "../../features/user/model/dao/UserDao.ts";
import { CarDao } from "../../features/car/model/dao/CarDao.ts";
import { BaseConfig } from "../../constants/index.ts";
import { ModelDao } from "../../features/car/model/dao/ModelDao.ts";
import { MakeDao } from "../../features/car/model/dao/MakeDao.ts";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    storage: SupabaseStorageAdapter;
    attachmentQueue?: PhotoAttachmentQueue;
    private _userDao?: UserDao;
    private _carDao?: CarDao;
    private _makeDao?: MakeDao;
    private _modelDao?: ModelDao;

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

        if(BaseConfig.SUPABASE_BUCKET) {
            this.attachmentQueue = new PhotoAttachmentQueue({
                powersync: this.powersync,
                storage: this.storage,
                onDownloadError: async (attachment: AttachmentRecord, exception: any) => {
                    if(exception.toString() === "StorageApiError: Object not found") {
                        return { retry: false };
                    }

                    return { retry: true };
                },
                onUploadError: async (attachment: AttachmentRecord, exception: any) => {
                    console.log("attachment upload hiba", exception);
                    return { retry: false };
                }
            });
        }
    }

    get userDao(): UserDao {
        if(!this._userDao) this._userDao = new UserDao(this.db, this.attachmentQueue);

        return this._userDao;
    }

    get carDao(): CarDao {
        if(!this._carDao) this._carDao = new CarDao(this.db, this.storage, this.attachmentQueue);

        return this._carDao;
    }

    get makeDao(): MakeDao {
        if(!this._makeDao) this._makeDao = new MakeDao(this.db);

        return this._makeDao;
    }

    get modelDao(): ModelDao {
        if(!this._modelDao) this._modelDao = new ModelDao(this.db, this.makeDao);

        return this._modelDao;
    }

    async init() {
        await this.powersync.init();
        await this.powersync.connect(this.supabaseConnector);

        if(this.attachmentQueue) {
            await this.attachmentQueue.init();
        }
    }

    async disconnect() {
        await this.powersync.disconnectAndClear();
    }
}