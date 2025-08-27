import React, { ReactNode, useMemo } from "react";
import { PowerSyncContext } from "@powersync/react-native";
import { useDatabase } from "./DatabaseContext.ts";

interface PowerSyncProviderProps {
    children: ReactNode | null;
}

export const DatabaseProvider: React.FC<PowerSyncProviderProps> = ({ children }) => {
    const { powersync } = useDatabase();
    const db = useMemo(() => powersync, []);

    return (
        <PowerSyncContext.Provider
            value={ db }
        >
            { children }
        </PowerSyncContext.Provider>
    );
};