import { Context, createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";

type AuthContextValue = {
    providers: Array<string>
    hasPassword: boolean // if the user use google oauth then dont have (without identity link)
    authenticated: boolean | null
    openAccountVerification: (email: string) => void
    signUp: () => Promise<void>
    signIn: () => Promise<void>
    signOut: (disabledToast?: boolean) => Promise<void>
    deleteAccount: () => Promise<void>
    refreshSession: () => Promise<void>

    // TODO: not verified user rework
    notVerifiedUser: User | null
    updateNotVerifiedUser: (newNotVerifiedUser: User | null) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => useContext<AuthContextValue>(AuthContext as Context<AuthContextValue>);
