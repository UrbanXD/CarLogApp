import React, { ProviderProps, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import { useDatabase } from "../database/DatabaseContext.ts";
import { getUser, isUserLoading } from "../../features/user/model/selectors/index.ts";
import { Session, User } from "@supabase/supabase-js";
import { UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import { ImageType } from "../../utils/pickImage.ts";
import { updateUser } from "../../features/user/model/actions/updateUser.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../constants/index.ts";
import { loadUser } from "../../features/user/model/actions/loadUser.ts";
import { loadCars } from "../../features/car/model/actions/loadCars.ts";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { supabaseConnector } = database;

    const user = useAppSelector(getUser);
    const userLoading = useAppSelector(isUserLoading);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const [session, setSession] = useState<Session | null>(null);
    const [sessionLoading, setSessionLoading] = useState<boolean>(true);

    const setUser = (newUser: UserTableType | null, newAvatar?: ImageType | null) => {
        dispatch(updateUser({ database, newUser, newAvatar }));
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
                user,
                setUser,
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