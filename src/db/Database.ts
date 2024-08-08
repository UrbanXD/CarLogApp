import {AbstractPowerSyncDatabase, PowerSyncDatabase} from "@powersync/react-native";
import {AppSchema, DatabaseType} from "./AppSchema";
import {SupabaseConnector} from "./SupabaseConnector";
import {Kysely, wrapPowerSyncWithKysely} from "@powersync/kysely-driver";
import {Context, createContext, useContext} from "react";

export class Database {
    powersync: AbstractPowerSyncDatabase;
    db: Kysely<DatabaseType>;
    supabaseConnector: SupabaseConnector;

    constructor() {
        this.powersync = new PowerSyncDatabase({
            schema: AppSchema,
            database: {
                dbFilename: "carlog-app.sqlite"
            }
        })
        this.db = wrapPowerSyncWithKysely(this.powersync);
        this.supabaseConnector = new SupabaseConnector();
    }

    async init() {
        await this.powersync.init();
        await this.powersync.connect(this.supabaseConnector)
    }

    async disconnect() {
        await this.powersync.disconnectAndClear();
    }
}

const database = new Database();
export const DatabaseContext = createContext(database);
export const useDatabase = () => useContext<Database>(DatabaseContext as Context<Database>);