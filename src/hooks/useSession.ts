import { useDatabase } from "../features/Database/connector/Database";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { store } from "../features/Database/redux/store";
import { loadCars } from "../features/Database/redux/cars/functions/loadCars";
import { UserTableType } from "../features/Database/connector/powersync/AppSchema.ts";
import { useUser } from "./useUser.ts";
import { loadUser } from "../features/Database/redux/user/functions/loadUser.ts";

export const useSession = () => {
    const database = useDatabase();
    const { supabaseConnector } = database;
    const {
        user,
        isUserLoading,
        notVerifiedUser,
        fetchNotVerifiedUser,
        updateNotVerifiedUser
    } = useUser();

    const [session, setSession] = useState<Session | null>(null);
    const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);


    // adatok betoltese local db-bol
    const fetchLocalData = async () => {
        if(!session || !session.user) return

        void updateNotVerifiedUser(null);

        store.dispatch(loadUser({
            database,
            userId: session.user.id,
            defaultUserValue: {
                id: session.user.id,
                email: session.user.email,
                firstname: session.user.user_metadata.firstname,
                lastname: session.user.user_metadata.lastname,
                avatarColor: session.user.user_metadata.avatarColor,
                avatarImage: session.user.user_metadata.avatarImage,
            } as UserTableType
        }));

        store.dispatch(loadCars(database));
    }

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getSession()
            .then(
                ({ data: { session } }) => {
                    setSession(session);
                    setIsSessionLoading(false);
                }
            );

        supabaseConnector
            .client
            .auth
            .onAuthStateChange(
                (_event, session) => setSession(session)
            );


        void fetchNotVerifiedUser();
    }, []);

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getUser()
            .then(
                ({ data: { user } }) => {
                    if(user) void updateNotVerifiedUser(user);
                }
            );

        if(session && session.user) {
            void fetchLocalData();
        }
    }, [session]);

    const refreshSession = async () => {
        const { error } =
            await supabaseConnector
                .client
                .auth
                .refreshSession();

        if(error) console.error("refreshError", error);
    }

    return {
        session,
        isSessionLoading,
        refreshSession,
        user,
        isUserLoading,
        notVerifiedUser
    }
}

export type UseSessionReturnType = ReturnType<typeof useSession>