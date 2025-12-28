import React, { ReactNode, useEffect, useState } from "react";
import { DatabaseContext } from "./DatabaseContext.ts";
import { Database } from "../../database/connector/Database.ts";
import * as SplashScreen from "expo-splash-screen";

type DatabaseProviderProps = {
    children: ReactNode | null
}

SplashScreen.preventAutoHideAsync();

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [database, setDatabase] = useState<Database | null>(null);
    const [error, setError] = useState<Error | null>(null);

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

    if(error || !database) return null;

    return (
        <DatabaseContext.Provider value={ database }>
            { children }
        </DatabaseContext.Provider>
    );
}