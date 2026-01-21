import { AbstractPowerSyncDatabase, PowerSyncDatabase } from "@powersync/react-native";
import { AppSchema, DatabaseType } from "./powersync/AppSchema.ts";
import { SupabaseConnector } from "./SupabaseConnector.ts";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { ParseJSONResultsPlugin } from "kysely";
import { SupabaseStorageAdapter } from "./storage/SupabaseStorageAdapter.ts";
import { PhotoAttachmentQueue } from "./powersync/PhotoAttachmentQueue.ts";
import { AttachmentRecord } from "@powersync/attachments";
import { UserDao } from "../../features/user/model/dao/UserDao.ts";
import { CarDao } from "../../features/car/model/dao/CarDao.ts";
import { BaseConfig } from "../../constants";
import { ModelDao } from "../../features/car/model/dao/ModelDao.ts";
import { MakeDao } from "../../features/car/model/dao/MakeDao.ts";
import { ExpenseDao } from "../../features/expense/model/dao/ExpenseDao.ts";
import { FuelTypeDao } from "../../features/car/_features/fuel/model/dao/FuelTypeDao.ts";
import { FuelUnitDao } from "../../features/car/_features/fuel/model/dao/FuelUnitDao.ts";
import { OdometerUnitDao } from "../../features/car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { OdometerLogDao } from "../../features/car/_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerLogTypeDao } from "../../features/car/_features/odometer/model/dao/OdometerLogTypeDao.ts";
import { ExpenseTypeDao } from "../../features/expense/model/dao/ExpenseTypeDao.ts";
import { CurrencyDao } from "../../features/_shared/currency/model/dao/CurrencyDao.ts";
import { FuelLogDao } from "../../features/car/_features/fuel/model/dao/FuelLogDao.ts";
import { ServiceLogDao } from "../../features/expense/_features/service/model/dao/ServiceLogDao.ts";
import { ServiceTypeDao } from "../../features/expense/_features/service/model/dao/ServiceTypeDao.ts";
import { ServiceItemDao } from "../../features/expense/_features/service/model/dao/ServiceItemDao.ts";
import { ServiceItemTypeDao } from "../../features/expense/_features/service/model/dao/ServiceItemTypeDao.ts";
import { PlaceDao } from "../../features/ride/_features/place/model/dao/placeDao.ts";
import { PassengerDao } from "../../features/ride/_features/passenger/model/dao/passengerDao.ts";
import { RideLogDao } from "../../features/ride/model/dao/rideLogDao.ts";
import { StatisticsDao } from "../../features/statistics/model/dao/statisticsDao.ts";
import { File, Paths } from "expo-file-system";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import LargeSecureStore from "./storage/LargeSecureStorage.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { open } from "@journeyapps/react-native-quick-sqlite";
import { SEED_DATABASE_NAME } from "@env";
import { RideExpenseMapper } from "../../features/ride/_features/rideExpense/model/mapper/rideExpenseMapper.ts";
import { RidePlaceMapper } from "../../features/ride/_features/place/model/mapper/ridePlaceMapper.ts";
import { RidePassengerMapper } from "../../features/ride/_features/passenger/model/mapper/ridePassengerMapper.ts";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    storage: SupabaseStorageAdapter;
    attachmentQueue?: PhotoAttachmentQueue;
    private initPromise: Promise<void> | null = null;
    private readonly syncSeedDatabase: boolean = false;
    private _userDao?: UserDao;
    private _carDao?: CarDao;
    private _makeDao?: MakeDao;
    private _modelDao?: ModelDao;
    private _currencyDao?: CurrencyDao;
    private _expenseTypeDao?: ExpenseTypeDao;
    private _expenseDao?: ExpenseDao;
    private _fuelTypeDao?: FuelTypeDao;
    private _fuelUnitDao?: FuelUnitDao;
    private _fuelLogDao?: FuelLogDao;
    private _odometerUnitDao?: OdometerUnitDao;
    private _odometerLogTypeDao?: OdometerLogTypeDao;
    private _odometerLogDao?: OdometerLogDao;
    private _serviceLogDao?: ServiceLogDao;
    private _serviceTypeDao?: ServiceTypeDao;
    private _serviceItemTypeDao?: ServiceItemTypeDao;
    private _serviceItemDao?: ServiceItemDao;
    private _rideLogDao?: RideLogDao;
    private _placeDao?: PlaceDao;
    private _passengerDao?: PassengerDao;
    private _statisticsDao?: StatisticsDao;

    protected constructor(
        powersync: AbstractPowerSyncDatabase,
        db: Kysely<DatabaseType>,
        supabaseConnector: SupabaseConnector,
        storage: SupabaseStorageAdapter,
        syncSeedDatabase: boolean,
        attachmentQueue?: PhotoAttachmentQueue
    ) {
        this.powersync = powersync;
        this.db = db;
        this.supabaseConnector = supabaseConnector;
        this.storage = storage;
        this.syncSeedDatabase = syncSeedDatabase;
        this.attachmentQueue = attachmentQueue;
    }

    static async create() {
        try {
            const supabaseClient = createClient(
                BaseConfig.SUPABASE_URL,
                BaseConfig.SUPABASE_PUBLISHABLE_KEY,
                {
                    auth: {
                        persistSession: true,
                        storage: new LargeSecureStore()
                    }
                }
            );

            const { syncNeed } = await this.getSeedDatabase(supabaseClient);

            const powersync = new PowerSyncDatabase({
                schema: AppSchema,
                database: { dbFilename: BaseConfig.MAIN_DATABASE_NAME }
            });
            const db = wrapPowerSyncWithKysely<DatabaseType>(powersync, { plugins: [new ParseJSONResultsPlugin()] });
            const supabaseConnector = new SupabaseConnector(supabaseClient);
            const storage = supabaseConnector.storage;

            let attachmentQueue;
            if(BaseConfig.SUPABASE_ATTACHMENT_BUCKET) {
                attachmentQueue = new PhotoAttachmentQueue({
                    powersync,
                    storage,
                    onDownloadError: async (attachment: AttachmentRecord, exception: any) => {
                        console.log("attachment download error: ", exception);
                        if(exception.toString() === "StorageApiError: Object not found") {
                            return { retry: false };
                        }

                        return { retry: true };
                    },
                    onUploadError: async (attachment: AttachmentRecord, exception: any) => {
                        console.log("attachment upload error: ", exception);
                        return { retry: false };
                    }
                });
            }

            return new Database(powersync, db, supabaseConnector, storage, syncNeed, attachmentQueue);
        } catch(error) {
            console.error("Error at Database.create():", error);
            throw error;
        }
    }

    async init() {
        if(this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                await this.powersync.init();
                if(this.syncSeedDatabase) await this.autoSyncSeedDatabase();
                await this.powersync.connect(this.supabaseConnector);
                if(this.attachmentQueue) await this.attachmentQueue.init();
            } catch(e) {
                this.initPromise = null;
                console.log(e);
                throw e;
            }
        })();

        return this.initPromise;
    }

    async waitForInit() {
        if(this.initPromise) return this.initPromise;
        return this.init();
    }

    async disconnect() {
        this.initPromise = null;

        await this.powersync.disconnectAndClear({ clearLocal: false });
    }

    static async getSeedDatabase(supabaseClient: SupabaseClient): Promise<{ syncNeed: boolean }> {
        const globalSeedDbLastModificationAtLocal = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_GLOBAL_SEED_DB_LAST_MODIFICATION);
        const { data, error } = await supabaseClient
        .storage
        .from(BaseConfig.SUPABASE_SEED_BUCKET)
        .info(BaseConfig.SEED_DATABASE_NAME);
        const globalSeedDbLastModifiedAt = data?.lastModified;

        let syncSeedDatabase = false;
        if(
            !error &&
            (
                !globalSeedDbLastModifiedAt ||
                !globalSeedDbLastModificationAtLocal ||
                !dayjs(globalSeedDbLastModifiedAt).isValid() ||
                !dayjs(globalSeedDbLastModificationAtLocal).isValid() ||
                !dayjs(globalSeedDbLastModificationAtLocal).isAfter(globalSeedDbLastModifiedAt)
            )
        ) {
            const seedDatabaseUrl = supabaseClient
            .storage
            .from(BaseConfig.SUPABASE_SEED_BUCKET)
            .getPublicUrl(BaseConfig.SEED_DATABASE_NAME)
                .data
                .publicUrl;

            const newFile = new File(Paths.document.uri, SEED_DATABASE_NAME);
            const file = await File.downloadFileAsync(seedDatabaseUrl, newFile, { idempotent: true });
            if(file.exists && (file.info()?.size ?? 0) > 0) {
                syncSeedDatabase = true;
                await AsyncStorage.setItem(
                    BaseConfig.LOCAL_STORAGE_KEY_GLOBAL_SEED_DB_LAST_MODIFICATION,
                    dayjs(file.info()?.modificationTime).toISOString()
                );
            }
        }

        return { syncNeed: syncSeedDatabase };
    }

    async autoSyncSeedDatabase() {
        const seedDb = open(BaseConfig.SEED_DATABASE_NAME);

        try {
            const seedTablesResult = (await seedDb.execute(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                  AND name NOT LIKE 'sqlite_%'
            `)).rows?._array ?? [];
            const seedTables = seedTablesResult.map(row => row.name);

            for(const tableName of seedTables) {
                const tableExists = await this.powersync.get(`
                    SELECT name
                    FROM sqlite_master
                    WHERE type = 'table'
                      AND name = 'ps_data_local__${ tableName }'
                `);

                if(!tableExists) {
                    console.warn(`[Sync Seed Database] Table schema missing: '${ tableName }', skipped`);
                    continue;
                }

                const dataResult = await seedDb.execute(
                    `SELECT *
                     FROM ${ tableName }`
                );
                const rows = dataResult.rows?._array ?? [];

                if(rows.length === 0) continue;

                await this.powersync.writeTransaction(async (tx) => {
                    await tx.execute(`
                        DELETE
                        FROM ${ tableName }
                    `);

                    const batchSize = 500;
                    for(let i = 0; i < rows.length; i += batchSize) {
                        const batch = rows.slice(i, i + batchSize);

                        const columns = Object.keys(batch[0]).join(", ");
                        const singleRowPlaceholders = `(${ Object.keys(batch[0]).map(() => "?").join(",") })`;
                        const allPlaceholders = batch.map(() => singleRowPlaceholders).join(", ");

                        const batchSql = `
                            INSERT INTO ${ tableName } (${ columns })
                            VALUES ${ allPlaceholders }
                        `;

                        const flatValues = batch.flatMap(row => Object.values(row));
                        await tx.execute(batchSql, flatValues);
                    }
                });
            }
        } catch(e) {
            console.error("Sync seed database error:", e);
        } finally {
            seedDb.close();
        }
    }

    get currencyDao(): CurrencyDao {
        if(!this._currencyDao) this._currencyDao = new CurrencyDao(this.db, this.powersync);

        return this._currencyDao;
    }

    get userDao(): UserDao {
        if(!this._userDao) this._userDao = new UserDao(this.db, this.powersync, this.attachmentQueue);

        return this._userDao;
    }

    get makeDao(): MakeDao {
        if(!this._makeDao) this._makeDao = new MakeDao(this.db, this.powersync);

        return this._makeDao;
    }

    get modelDao(): ModelDao {
        if(!this._modelDao) this._modelDao = new ModelDao(this.db, this.powersync);

        return this._modelDao;
    }

    get expenseTypeDao(): ExpenseTypeDao {
        if(!this._expenseTypeDao) this._expenseTypeDao = new ExpenseTypeDao(this.db, this.powersync);

        return this._expenseTypeDao;
    }

    get expenseDao(): ExpenseDao {
        if(!this._expenseDao) this._expenseDao = new ExpenseDao(
            this.db,
            this.powersync,
            this.expenseTypeDao
        );

        return this._expenseDao;
    }

    get fuelTypeDao(): FuelTypeDao {
        if(!this._fuelTypeDao) this._fuelTypeDao = new FuelTypeDao(this.db, this.powersync);

        return this._fuelTypeDao;
    }

    get fuelUnitDao(): FuelUnitDao {
        if(!this._fuelUnitDao) this._fuelUnitDao = new FuelUnitDao(this.db, this.powersync);

        return this._fuelUnitDao;
    }

    get fuelLogDao(): FuelLogDao {
        if(!this._fuelLogDao) this._fuelLogDao = new FuelLogDao(
            this.db,
            this.powersync,
            this.fuelUnitDao,
            this.expenseDao,
            this.expenseTypeDao,
            this.odometerLogDao,
            this.odometerUnitDao
        );

        return this._fuelLogDao;
    }

    get odometerUnitDao(): OdometerUnitDao {
        if(!this._odometerUnitDao) this._odometerUnitDao = new OdometerUnitDao(this.db, this.powersync);

        return this._odometerUnitDao;
    }

    get odometerLogTypeDao(): OdometerLogTypeDao {
        if(!this._odometerLogTypeDao) this._odometerLogTypeDao = new OdometerLogTypeDao(this.db, this.powersync);

        return this._odometerLogTypeDao;
    }

    get odometerLogDao(): OdometerLogDao {
        if(!this._odometerLogDao) this._odometerLogDao = new OdometerLogDao(
            this.db,
            this.powersync,
            this.odometerLogTypeDao
        );

        return this._odometerLogDao;
    }

    get serviceLogDao(): ServiceLogDao {
        if(!this._serviceLogDao) {
            this._serviceLogDao = new ServiceLogDao(
                this.db,
                this.powersync,
                this.expenseDao,
                this.odometerLogDao,
                this.serviceTypeDao,
                this.odometerUnitDao,
                this.expenseTypeDao,
                this.serviceItemDao,
                this.carDao
            );
        }

        return this._serviceLogDao;
    }

    get serviceTypeDao(): ServiceTypeDao {
        if(!this._serviceTypeDao) {
            this._serviceTypeDao = new ServiceTypeDao(this.db, this.powersync);
        }

        return this._serviceTypeDao;
    }

    get serviceItemTypeDao(): ServiceItemTypeDao {
        if(!this._serviceItemTypeDao) {
            this._serviceItemTypeDao = new ServiceItemTypeDao(this.db, this.powersync);
        }

        return this._serviceItemTypeDao;
    }

    get serviceItemDao(): ServiceItemDao {
        if(!this._serviceItemDao) {
            this._serviceItemDao = new ServiceItemDao(
                this.db,
                this.powersync,
                this.serviceItemTypeDao,
                this.currencyDao
            );
        }

        return this._serviceItemDao;
    }

    get carDao(): CarDao {
        if(!this._carDao) {
            this._carDao = new CarDao(
                this.db,
                this.powersync,
                this.attachmentQueue,
                this.odometerUnitDao,
                this.currencyDao
            );
        }

        return this._carDao;
    }

    get placeDao(): PlaceDao {
        if(!this._placeDao) this._placeDao = new PlaceDao(this.db, this.powersync);

        return this._placeDao;
    }

    get passengerDao(): PassengerDao {
        if(!this._passengerDao) this._passengerDao = new PassengerDao(this.db, this.powersync);

        return this._passengerDao;
    }

    get rideLogDao(): RideLogDao {
        if(!this._rideLogDao) {
            const rideExpenseMapper = new RideExpenseMapper(this.expenseDao, this.expenseTypeDao, this.currencyDao);
            const ridePlaceMapper = new RidePlaceMapper();
            const ridePassengerMapper = new RidePassengerMapper();

            this._rideLogDao = new RideLogDao(
                this.db,
                this.powersync,
                rideExpenseMapper,
                ridePlaceMapper,
                ridePassengerMapper,
                this.odometerLogDao,
                this.odometerUnitDao,
                this.carDao
            );
        }

        return this._rideLogDao;
    }

    get statisticsDao(): StatisticsDao {
        if(!this._statisticsDao) this._statisticsDao = new StatisticsDao(
            this.db,
            this.expenseTypeDao,
            this.serviceTypeDao,
            this.serviceItemTypeDao
        );

        return this._statisticsDao;
    }
}