import { Context, createContext, useContext } from "react";
import { SignUpRequest } from "../../user/schemas/signUpRequestSchema.ts";
import { SignInRequest } from "../../user/schemas/signInRequest.ts";

export type AuthContextValue = {
    authenticated: boolean | null
    signUp: (request: SignUpRequest) => void
    signIn: (request: SignInRequest) => void
    signOut: (disabledToast?: boolean) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthNew = () => useContext<AuthContextValue>(AuthContext as Context<AuthContextValue>);