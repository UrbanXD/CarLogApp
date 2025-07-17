import { Context, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { UserDto } from "../../features/user/model/types/user.ts";
import { UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import { ImageType } from "../../utils/pickImage.ts";

type AuthContextValue = {
    session: Session | null
    sessionLoading: boolean
    refreshSession: () => Promise<void>
    signOut: () => Promise<void>
    user: UserDto | null
    setUser: (user: UserTableType | null, newAvatar?: ImageType | null) => void
    userLoading: boolean
    notVerifiedUser: User | null
    fetchNotVerifiedUser: () => Promise<void>
    updateNotVerifiedUser: (newNotVerifiedUser: User | null) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () =>
    useContext<AuthContextValue>(
        AuthContext as Context<AuthContextValue>
    );
