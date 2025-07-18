import React, { ProviderProps, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import { useDatabase } from "../database/DatabaseContext.ts";
import { getUser, isUserLoading } from "../../features/user/model/selectors/index.ts";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../constants/index.ts";
import { loadUser } from "../../features/user/model/actions/loadUser.ts";
import { loadCars } from "../../features/car/model/actions/loadCars.ts";
import { router } from "expo-router";
import { SignOutToast } from "../../features/user/presets/toast/index.ts";
import { getToastMessage } from "../../ui/alert/utils/getToastMessage.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const database = useDatabase();
    const { supabaseConnector } = database;

    const user = useAppSelector(getUser);
    const userLoading = useAppSelector(isUserLoading);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const [session, setSession] = useState<Session | null>(null);
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);

    const signOut = async (disabledToast: boolean = false) => {
        try {
            const { error } =
                await supabaseConnector
                .client
                .auth
                .signOut();

            if(error) throw error;

            router.replace("/backToRootIndex");
            if(!disabledToast) openToast(SignOutToast.success());
            await database.disconnect();
        } catch(error) {
            if(error instanceof AuthError && !disabledToast) {
                return openToast(
                    getToastMessage({
                        messages: SignOutToast,
                        error
                    })
                );
            }
            // ha nem AuthError akkor sikeres a kijelentkezes, de mashol hiba tortent (pl: powersync)
        }
    };

    const fetchNotVerifiedUser = async () => {
        const newNotVerifiedUser = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
        if(!newNotVerifiedUser) return;

        setNotVerifiedUser(JSON.parse(newNotVerifiedUser));
    };

    const updateNotVerifiedUser = async (newNotVerifiedUser: User | null) => {
        setNotVerifiedUser(newNotVerifiedUser);

        if(newNotVerifiedUser) {
            void AsyncStorage.setItem(
                BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER,
                JSON.stringify(newNotVerifiedUser)
            );
        } else {
            void AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
        }
    };

    // adatok betoltese local db-bol
    const fetchLocalData = async () => {
        if(!session || !session.user) return;

        void updateNotVerifiedUser(null);

        dispatch(loadUser({
            database,
            userId: session.user.id,
            defaultUserValue: {
                id: session.user.id,
                email: session.user.email,
                firstname: session.user.user_metadata.firstname,
                lastname: session.user.user_metadata.lastname,
                avatarColor: session.user.user_metadata.avatarColor,
                avatarImage: session.user.user_metadata.avatarImage
            } as UserTableType
        }));

        dispatch(loadCars(database));
    };

    useEffect(() => {
        supabaseConnector
        .client
        .auth
        .getSession()
        .then(
            ({ data: { session } }) => {
                setSession(session);
                setSessionLoading(false);
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

        if(error) console.debug("refreshError", error);
    };

    return (
        <AuthContext.Provider
            value={ {
                session,
                sessionLoading,
                refreshSession,
                signOut,
                user,
                userLoading,
                notVerifiedUser,
                fetchNotVerifiedUser,
                updateNotVerifiedUser
            } }
        >
            { children }
        </AuthContext.Provider>
    );
};