import {
    AbstractPowerSyncDatabase,
    CrudEntry,
    PowerSyncBackendConnector,
    UpdateType,
} from '@powersync/react-native';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { BaseConfig } from "./BaseConfig";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";

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

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: "251073631752-b8bsmbe8uum81epqj2pa0d3n8act4mi1.apps.googleusercontent.com",
});

export class SupabaseConnector implements PowerSyncBackendConnector {
    client: SupabaseClient;

    constructor() {
        this.client = createClient(BaseConfig.SUPABASE_URL, BaseConfig.SUPABASE_ANON_KEY, {
            auth: {
                storage: AsyncStorage,
            },
        });
    }

    async login(username: string, password: string) {
        const { error } = await this.client.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error) {
            throw error;
        }
    }

    async googleLogin() {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo.data)
            if (userInfo.data?.idToken) {
                const { data, error } = await this.client.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                })
            } else {
                throw new Error('no ID token present!')
            }
        } catch (error: any) {
            console.log(error.code, error.message)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    }

    async fetchCredentials() {
        const {
            data: { session },
            error,
        } = await this.client.auth.getSession();

        if (!session || error) {
            throw new Error(`Could not fetch Supabase credentials: ${error}`);
        }

        console.debug('session expires at', session.expires_at);

        return {
            client: this.client,
            endpoint: BaseConfig.POWER_SYNC_URL,
            token: session.access_token ?? '',
            expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
            userID: session.user.id,
        };
    }

    async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
        const transaction = await database.getNextCrudTransaction();

        if (!transaction) {
            return;
        }

        let lastOp: CrudEntry | null = null;
        try {
            // Note: If transactional consistency is important, use database functions
            // or edge functions to process the entire transaction in a single call.
            for (const op of transaction.crud) {
                lastOp = op;
                const table = this.client.from(op.table);
                let result: any = null;
                switch (op.op) {
                    case UpdateType.PUT:
                        // eslint-disable-next-line no-case-declarations
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

                if (result.error) {
                    throw new Error(`Could not ${op.op} data to Supabase error: ${JSON.stringify(result)}`);
                }
            }

            await transaction.complete();
        } catch (ex: any) {
            console.debug(ex);
            if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
                /**
                 * Instead of blocking the queue with these errors,
                 * discard the (rest of the) transaction.
                 *
                 * Note that these errors typically indicate a bug in the application.
                 * If protecting against data loss is important, save the failing records
                 * elsewhere instead of discarding, and/or notify the user.
                 */
                console.error(`Data upload error - discarding ${lastOp}`, ex);
                await transaction.complete();
            } else {
                // Error may be retryable - e.g. network error or temporary server error.
                // Throwing an error here causes this call to be retried after a delay.
                throw ex;
            }
        }
    }
}