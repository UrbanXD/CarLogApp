import React, { ReactNode, useEffect, useRef, useState } from "react";
import { DatabaseContext } from "./DatabaseContext.ts";
import { Database } from "../../database/connector/Database.ts";
import * as SplashScreen from "expo-splash-screen";
import * as Network from "expo-network";
import { PowerSyncContext } from "@powersync/react-native";

type DatabaseProviderProps = {
    children: ReactNode | null
}

SplashScreen.preventAutoHideAsync();

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [database, setDatabase] = useState<Database | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const isSyncing = useRef(false);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const databaseInstance = await Database.create();
                if(mounted) {
                    setDatabase(databaseInstance);
                }
            } catch(e) {
                if(mounted) {
                    setError(e as Error);
                }
            }
        };

        init();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const checkAndSync = async (state) => {
            if(state.isConnected && state.isInternetReachable && !isSyncing.current && database) {
                try {
                    isSyncing.current = true;

                    const { syncNeed } = await Database.getSeedDatabase(database.supabaseConnector.client);
                    if(syncNeed) await database.autoSyncSeedDatabase();
                } catch(error) {
                    console.error("Seed db sync error at network state change:", error);
                } finally {
                    isSyncing.current = false;
                }
            }
        };

        const subscription = Network.addNetworkStateListener(state => checkAndSync(state));

        Network.getNetworkStateAsync().then(checkAndSync);

        return () => subscription.remove();
    }, [database]);

    if(error || !database) return null;

    return (
        <PowerSyncContext.Provider value={ database.powersync }>
            <DatabaseContext.Provider value={ database }>
                { children }
            </DatabaseContext.Provider>
        </PowerSyncContext.Provider>
    );
}