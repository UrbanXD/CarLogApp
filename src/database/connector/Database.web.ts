import { AbstractPowerSyncDatabase } from "@powersync/common";
import { PowerSyncDatabase } from "@powersync/web/umd";
import { AppSchema, DatabaseType } from "./powersync/AppSchema.ts";
import { SupabaseConnector } from "./SupabaseConnector.ts";
import { Kysely, wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { ParseJSONResultsPlugin } from "kysely";
import { SupabaseStorageAdapter } from "./storage/SupabaseStorageAdapter.ts";

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

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import LargeSecureStore from "./storage/LargeSecureStorage";


import { RideExpenseMapper } from "../../features/ride/_features/rideExpense/model/mapper/rideExpenseMapper.ts";
import { RidePlaceMapper } from "../../features/ride/_features/place/model/mapper/ridePlaceMapper.ts";
import { RidePassengerMapper } from "../../features/ride/_features/passenger/model/mapper/ridePassengerMapper.ts";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;
    storage: SupabaseStorageAdapter;
    attachmentQueue?: any;
    private initPromise: Promise<void> | null = null;
    private readonly syncSeedDatabase: boolean = true;
    private seedSyncPromise: Promise<void> | null = null;
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

    protected constructor(
        powersync: AbstractPowerSyncDatabase,
        db: Kysely<DatabaseType>,
        supabaseConnector: SupabaseConnector,
        storage: SupabaseStorageAdapter,
        syncSeedDatabase: boolean,
        attachmentQueue?: any
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

            // `make` and `model` are local-only PowerSync tables. The web client
            // must populate them after authentication, just like the native
            // client imports them from its seed SQLite file.
            const syncNeed = true;

            const powersync = new PowerSyncDatabase({
                schema: AppSchema,
                database: {
                    dbFilename: BaseConfig.MAIN_DATABASE_NAME,
                    worker: "/@powersync/worker/WASQLiteDB.umd.js"
                },
                sync: {
                    worker: "/@powersync/worker/SharedSyncImplementation.umd.js"
                }
            });
            const db = wrapPowerSyncWithKysely<DatabaseType>(powersync, { plugins: [new ParseJSONResultsPlugin()] });
            const supabaseConnector = new SupabaseConnector(supabaseClient);
            const storage = supabaseConnector.storage;

            return new Database(powersync, db, supabaseConnector, storage, syncNeed);
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
        try {
            const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
            if(sessionError || !session) return { syncNeed: false };

            const localModifiedAt = this.getLocalSeedModifiedAt();
            const { data, error } = await supabaseClient
            .storage
            .from(BaseConfig.SUPABASE_SEED_BUCKET)
            .info(BaseConfig.SEED_DATABASE_NAME);
            const remoteModifiedAt = data?.lastModified;

            if(error || !remoteModifiedAt || !localModifiedAt) return { syncNeed: true };

            const localTimestamp = Date.parse(localModifiedAt);
            const remoteTimestamp = Date.parse(remoteModifiedAt);
            return {
                syncNeed: !Number.isFinite(localTimestamp) ||
                    !Number.isFinite(remoteTimestamp) ||
                    localTimestamp < remoteTimestamp
            };
        } catch(error) {
            console.warn("Could not check the web seed database version:", error);
            return { syncNeed: true };
        }
    }

    async autoSyncSeedDatabase() {
        if(this.seedSyncPromise) return this.seedSyncPromise;

        this.seedSyncPromise = (async () => {
            try {
                await this.powersync.init();

                const {
                    data: { session },
                    error: sessionError
                } = await this.supabaseConnector.client.auth.getSession();
                if(sessionError) throw sessionError;
                if(!session) return;

                const makeCount = await this.powersync.get<{ count: number }>("SELECT COUNT(*) AS count FROM make");
                const modelCount = await this.powersync.get<{ count: number }>("SELECT COUNT(*) AS count FROM model");
                const { syncNeed } = await Database.getSeedDatabase(this.supabaseConnector.client);
                if(!syncNeed && makeCount.count > 0 && modelCount.count > 0) return;

                const [makes, models] = await Promise.all([
                    this.fetchCatalogRows("make", "id, name"),
                    this.fetchCatalogRows("model", "id, make_id, name, start_year, end_year")
                ]);

                // A permissions/configuration error can produce an empty result.
                // Keep the previously loaded local catalog in that case.
                if(makes.length === 0 || models.length === 0) {
                    throw new Error(`The Supabase car catalog returned no rows (makes: ${ makes.length }, models: ${ models.length }).`);
                }

                await this.powersync.writeTransaction(async (tx) => {
                    await tx.execute("DELETE FROM model");
                    await tx.execute("DELETE FROM make");

                    await this.insertCatalogRows(tx, "make", ["id", "name"], makes);
                    await this.insertCatalogRows(
                        tx,
                        "model",
                        ["id", "make_id", "name", "start_year", "end_year"],
                        models.map((model) => ({
                            ...model,
                            id: String(model.id),
                            make_id: String(model.make_id),
                            start_year: model.start_year == null ? null : String(model.start_year),
                            end_year: model.end_year == null ? null : String(model.end_year)
                        }))
                    );
                });

                const { data: seedInfo, error: seedInfoError } = await this.supabaseConnector.client
                .storage
                .from(BaseConfig.SUPABASE_SEED_BUCKET)
                .info(BaseConfig.SEED_DATABASE_NAME);
                if(!seedInfoError && seedInfo?.lastModified) {
                    Database.setLocalSeedModifiedAt(seedInfo.lastModified);
                }

                console.info(`Loaded web car catalog: ${ makes.length } makes and ${ models.length } models.`);
            } catch(error) {
                // Do not prevent sign-in or PowerSync user-data sync if catalog
                // refresh is temporarily unavailable. The next online event
                // retries because the version marker is only saved on success.
                console.error("Web car catalog seed sync failed:", error);
            }
        })();

        try {
            await this.seedSyncPromise;
        } finally {
            this.seedSyncPromise = null;
        }
    }

    private static getLocalSeedModifiedAt(): string | null {
        if(typeof localStorage === "undefined") return null;
        const key = BaseConfig.LOCAL_STORAGE_KEY_GLOBAL_SEED_DB_LAST_MODIFICATION || "carlog.global-seed-db-last-modification";
        return localStorage.getItem(key);
    }

    private static setLocalSeedModifiedAt(value: string): void {
        if(typeof localStorage === "undefined") return;
        const key = BaseConfig.LOCAL_STORAGE_KEY_GLOBAL_SEED_DB_LAST_MODIFICATION || "carlog.global-seed-db-last-modification";
        localStorage.setItem(key, value);
    }

    private async fetchCatalogRows(tableName: "make" | "model", columns: string): Promise<Array<Record<string, any>>> {
        const pageSize = 1000;
        const rows: Array<Record<string, any>> = [];

        for(let offset = 0; ; offset += pageSize) {
            const { data, error } = await this.supabaseConnector.client
            .from(tableName)
            .select(columns)
            .order("id", { ascending: true })
            .range(offset, offset + pageSize - 1);

            if(error) throw error;
            rows.push(...(data ?? []));
            if(!data || data.length < pageSize) break;
        }

        return rows;
    }

    private async insertCatalogRows(
        tx: { execute: (sql: string, parameters?: any[]) => Promise<unknown> },
        tableName: "make" | "model",
        columns: string[],
        rows: Array<Record<string, any>>
    ): Promise<void> {
        const batchSize = 400;
        const rowPlaceholder = `(${ columns.map(() => "?").join(", ") })`;

        for(let offset = 0; offset < rows.length; offset += batchSize) {
            const batch = rows.slice(offset, offset + batchSize);
            const placeholders = batch.map(() => rowPlaceholder).join(", ");
            const values = batch.flatMap((row) => columns.map((column) => {
                const value = row[column];
                return value == null ? null : column === "id" || column === "make_id" ? String(value) : value;
            }));
            await tx.execute(
                `INSERT INTO ${ tableName } (${ columns.join(", ") }) VALUES ${ placeholders }`,
                values
            );
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
                this.serviceItemTypeDao,
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
                this.fuelUnitDao
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
}
