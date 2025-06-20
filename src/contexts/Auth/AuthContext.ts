import { Context, createContext, useContext } from "react";
import { UseSessionReturnType } from "../../hooks/useSession.ts";

type AuthContextValue =
    UseSessionReturnType

export const AuthContext =
    createContext<AuthContextValue | null>(null);

export const useAuth = () =>
    useContext<AuthContextValue>(
        AuthContext as Context<AuthContextValue>
    );
