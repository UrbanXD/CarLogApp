import React, { ProviderProps } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useSession } from "../../hooks/useSession.ts";

export const AuthProvider: React.FC<ProviderProps> = ({
    children
}) => {
    const sessionValue = useSession();

    return (
        <AuthContext.Provider
            value={ sessionValue }
        >
            { children }
        </AuthContext.Provider>
    )
}