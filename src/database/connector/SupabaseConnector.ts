import { AbstractPowerSyncDatabase, CrudEntry, PowerSyncBackendConnector, UpdateType } from '@powersync/react-native';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { BaseConfig } from "../../constants/index.ts";
import { SupabaseStorageAdapter } from './storage/SupabaseStorageAdapter.ts';
import LargeSecureStore from './storage/LargeSecureStorage.ts';

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
    // Class 22 — Data Exception
    // Examples include data type mismatch.
    new RegExp('^22...$'),
    // Class 23 — Integrity Constraint Violation.
    // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
    new RegExp('^23...$'),
    // INSUFFICIENT PRIVILEGE - typically a row-level security violation
    new RegExp('^42501$'),
];

export class SupabaseConnector implements PowerSyncBackendConnector {
    client: SupabaseClient;
    powersync: AbstractPowerSyncDatabase;
    storage: SupabaseStorageAdapter;

    constructor(powersync: AbstractPowerSyncDatabase) {
        this.client = createClient(
            BaseConfig.SUPABASE_URL,
            BaseConfig.SUPABASE_ANON_KEY,
            {
                        auth: {
                            persistSession: true,
                            storage: new LargeSecureStore(),
                        },
                   }
        );

        this.powersync = powersync;
        this.storage = new SupabaseStorageAdapter({ client: this.client });
    }

    async fetchCredentials() {
        const {
            data: { session },
            error,
        } = await this.client.auth.getSession();

        if (!session || error) throw new Error(`Could not fetch Supabase credentials: ${error}`);

        return {
            client: this.client,
            endpoint: BaseConfig.POWERSYNC_URL,
            token: session.access_token ?? '',
            expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
            userID: session.user.id,
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
        const transaction = await database.getNextCrudTransaction();
        if (!transaction) return;

        let lastOp: CrudEntry | null = null;
        try {
            for (const op of transaction.crud) {
                lastOp = op;
                const table = this.client.from(op.table);
                let result: any = null;
                switch (op.op) {
                    case UpdateType.PUT:
                        const record = { ...op.opData, id: op.id };
                        result = await table.upsert(record);
                        break;
                    case UpdateType.PATCH:
                        result = await table.update(op.opData).eq('id', op.id);
                        break;
                    case UpdateType.DELETE:
                        result = await table.delete().eq('id', op.id);
                        break;
                }

                if (result && result.error) {
                    throw new Error(`Could not ${op.op} data to Supabase error: ${JSON.stringify(result)}`);
                }
            }

            await transaction.complete();
        } catch (ex: any) {
            console.debug(ex);
            if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
                console.error(`Data upload error - discarding ${lastOp}`, ex);
                await transaction.complete();
            } else {
                throw ex;
            }
        }
    }
}