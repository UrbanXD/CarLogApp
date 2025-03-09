import { useDatabase } from "../features/Database/connector/Database";
import { useCallback, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/constants";
import { store } from "../features/Database/redux/store";
import { loadCars } from "../features/Database/redux/cars/functions/loadCars";
import { getImageFromAttachmentQueue } from "../features/Database/utils/getImageFromAttachmentQueue";
import { UserTableType } from "../features/Database/connector/powersync/AppSchema.ts";

export type UserType = UserTableType & {
    avatarImage?: { path: string, image: string }
}

export const useSession = () => {
    const database = useDatabase();
    const { supabaseConnector, attachmentQueue } = database;

    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<UserType | null>(null);
    const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const fetchUser = useCallback(async (userId: string) => {
        if(!session || !session.user) return;

        try {
            const userTableRow = await database.userDAO.getUser(userId);
            const avatarImage =
                await getImageFromAttachmentQueue(
                    attachmentQueue,
                    userTableRow.avatarImage
                );

            setUser({
                ...userTableRow,
                avatarImage
            });
        } catch (_) {
            const avatarImage =
                await getImageFromAttachmentQueue(
                    attachmentQueue,
                    session.user.user_metadata.avatarImage
                );

            setUser({
                email: session.user.email,
                firstname: session.user.user_metadata.firstname,
                lastname: session.user.user_metadata.lastname,
                avatarColor: session.user.user_metadata.avatarColor,
                avatarImage
            });
        }
    })

    const fetchLocalData = async (userId: string) => {
        // adatok betoltese local db-bol
        fetchUser(userId).then(user => setIsUserLoading(false));

        store.dispatch(loadCars(database));
    }

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getSession()
            .then(
                ({ data: { session } }) => setSession(session)
            );

        supabaseConnector
            .client
            .auth
            .onAuthStateChange(
                (_event, session) => setSession(session)
            );

        AsyncStorage
            .getItem(LOCAL_STORAGE_KEYS.notConfirmedUser)
            .then(
                (value) => {
                    if(!value) return;

                    setNotVerifiedUser(JSON.parse(value) as User);
                }
            );
    }, []);

    useEffect(() => {
        supabaseConnector
            .client
            .auth
            .getUser()
            .then(
                ({ data: { user } }) => {
                    if(user) setNotVerifiedUser(null);
                }
            );

        if(session && session.user) {
            AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.notConfirmedUser);
            fetchLocalData(session.user.id);
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
        user,
        isUserLoading,
        notVerifiedUser,
        setNotVerifiedUser,
        refreshSession
    }
}

export type UseSessionReturnType = ReturnType<typeof useSession>