import React, { ProviderProps, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import { useDatabase } from "../database/DatabaseContext.ts";
import { getUser, isUserLoading } from "../../features/user/model/selectors/index.ts";
import { AuthError, Session, User } from "@supabase/supabase-js";
import { CarBrandTableType, CarModelTableType, UserTableType } from "../../database/connector/powersync/AppSchema.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseConfig } from "../../constants/index.ts";
import { loadUser } from "../../features/user/model/actions/loadUser.ts";
import { loadCars } from "../../features/car/model/actions/loadCars.ts";
import { router } from "expo-router";
import { SignOutToast } from "../../features/user/presets/toast/index.ts";
import { getToastMessage } from "../../ui/alert/utils/getToastMessage.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { getUUID } from "../../database/utils/uuid.ts";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const database = useDatabase();
    const { supabaseConnector, powersync, carDAO } = database;

    const carBrandsAndModelsLoaded = useRef(false);
    const initialSync = useRef(true);

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

            router.dismissAll();
            router.push("/backToRootIndex");

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

    const initialLoadCarBrands = async () => {
        if(await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_CAR_BRANDS_VERSION) === BaseConfig.CAR_BRANDS_VERSION && await carDAO.areCarBrandsAndModelsExists()) return;

        import("../../assets/cars.json").then(async carBrandsData => {
            const carBrands: Array<CarBrandTableType> = [];
            const carModels: Array<CarModelTableType> = [];

            carBrandsData.default.map(rawBrand => {
                if(!rawBrand?.models || rawBrand.models.length === 0) return;

                const brand: CarBrandTableType = { id: getUUID(), name: rawBrand.brand };
                carBrands.push(brand);
                rawBrand.models.map(rawModel => {
                    const endYear = rawModel.years.endYear !== "" ? Number(rawModel.years.endYear) : null;
                    const model: CarModelTableType = {
                        id: getUUID(),
                        brand: brand.id,
                        name: rawModel.name,
                        startYear: Number(rawModel.years.startYear),
                        endYear
                    };
                    carModels.push(model);
                });
            });

            await carDAO.updateCarBrands(carBrands);
            await carDAO.updateCarModels(carModels);

            if(await carDAO.areCarBrandsAndModelsExists()) AsyncStorage.setItem(
                BaseConfig.LOCAL_STORAGE_KEY_CAR_BRANDS_VERSION,
                BaseConfig.CAR_BRANDS_VERSION
            );
        });
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
        .onAuthStateChange(
            (_event, session) => {
                setSession(session);
                if(sessionLoading) setSessionLoading(false);
                if(session?.user.id === notVerifiedUser?.id) setNotVerifiedUser(null);
            }
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
            if(!carBrandsAndModelsLoaded.current) {
                carBrandsAndModelsLoaded.current = true;
                void initialLoadCarBrands();
            }

            return powersync.registerListener({
                statusChanged: status => {
                    if(status.hasSynced && initialSync.current) {
                        initialSync.current = false;
                        void fetchLocalData();
                    }
                }
            });
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