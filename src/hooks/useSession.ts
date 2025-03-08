import {useDatabase} from "../features/Database/connector/Database.ts";
import {useEffect, useState} from "react";
import {Session, User} from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCAL_STORAGE_KEYS } from "../constants/constants.ts";
import { store } from "../features/Database/redux/store.ts";
import { loadUser } from "../features/Database/redux/user/functions/loadUser.ts";
import { loadCars } from "../features/Database/redux/cars/functions/loadCars.ts";
import { useAppSelector } from "./index.ts";
import { UserState } from "../features/Database/redux/user/user.slices.ts";

export const useSession = () => {
    const database = useDatabase();
    const { supabaseConnector } = database;

    const [session, setSession] = useState<Session | null>(null);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const user = useAppSelector(state => state.user.user) as UserState["user"];

    const fetchLocalData = async (userId: string) => {
        // adatok betoltese local db-bol
        store.dispatch(
            loadUser({
                database,
                userId
            })
        );
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
        notVerifiedUser,
        setNotVerifiedUser,
        refreshSession
    }
}

export type UseSessionReturnType = ReturnType<typeof useSession>