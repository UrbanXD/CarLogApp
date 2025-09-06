import { Context, createContext, useContext } from "react";
import { SignUpRequest } from "../../user/schemas/signUpRequestSchema.ts";
import { SignInRequest } from "../../user/schemas/signInRequest.ts";
import { User } from "@supabase/supabase-js";

export type AuthContextValue = {
    authenticated: boolean | null
    notVerifiedUser: User | null
    signUp: (request: SignUpRequest) => void
    signIn: (request: SignInRequest) => void
    signOut: (disabledToast?: boolean) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => useContext<AuthContextValue>(AuthContext as Context<AuthContextValue>);