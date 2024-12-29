import React, { ReactNode, useMemo } from "react";
import { useDatabase } from "../connector/Database";
import { PowerSyncContext } from '@powersync/react-native';

interface PowerSyncProviderProps {
    children: ReactNode | null
}

export const DatabaseProvider: React.FC<PowerSyncProviderProps> = ({ children }) => {
    const { powersync } = useDatabase();
    const db = useMemo(() => {
        return powersync;
    }, []);

    return (
        <PowerSyncContext.Provider
            value={ db }
        >
            { children }
        </PowerSyncContext.Provider>
    )
}
