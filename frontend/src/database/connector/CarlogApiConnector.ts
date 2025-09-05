import {
    AbstractPowerSyncDatabase,
    CrudEntry,
    PowerSyncBackendConnector,
    PowerSyncCredentials,
    UpdateType
} from "@powersync/react-native";
import "react-native-url-polyfill/auto";
import { BaseConfig } from "../../constants/index.ts";
import { CarlogApi } from "../../features/api/carlogApiClient.ts";
import LargeSecureStorage from "./storage/newLargeSecureStorage.ts";

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
    // Class 22 — Data Exception
    // Examples include data type mismatch.
    new RegExp("^22...$"),
    // Class 23 — Integrity Constraint Violation.
    // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
    new RegExp("^23...$"),
    // INSUFFICIENT PRIVILEGE - typically a row-level security violation
    new RegExp("^42501$")
];

export class CarlogApiConnector implements PowerSyncBackendConnector {
    client: CarlogApi;
    powersync: AbstractPowerSyncDatabase;

    constructor(powersync: AbstractPowerSyncDatabase, carlogApi: CarlogApi) {
        this.client = carlogApi;
        this.powersync = powersync;
    }

    async fetchCredentials(): PowerSyncCredentials {
        const token = await LargeSecureStorage.getItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN);

        if(!token) throw new Error("No token provided");

        return {
            endpoint: "http://192.168.1.7:8081",
            token: token
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
        const transaction = await database.getNextCrudTransaction();
        if(!transaction) return;

        //TODO: megcsinalni itt es backenden is hogy a lekeresek menjenek
        let lastOp: CrudEntry | null = null;
        try {
            for(const op of transaction.crud) {
                lastOp = op;
                const table = this.client.from(op.table);
                let result: any = null;
                switch(op.op) {
                    case UpdateType.PUT:
                        const record = { ...op.opData, id: op.id };
                        result = await table.upsert(record);
                        break;
                    case UpdateType.PATCH:
                        result = await table.update(op.opData).eq("id", op.id);
                        break;
                    case UpdateType.DELETE:
                        result = await table.delete().eq("id", op.id);
                        break;
                }

                if(result && result.error) {
                    throw new Error(`Could not ${ op.op } data to Supabase error: ${ JSON.stringify(result) }`);
                }
            }

            await transaction.complete();
        } catch(ex: any) {
            console.debug(ex);
            if(typeof ex.code == "string" && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
                console.error(`Data upload error - discarding ${ lastOp }`, ex);
                await transaction.complete();
            } else {
                throw ex;
            }
        }
    }
}