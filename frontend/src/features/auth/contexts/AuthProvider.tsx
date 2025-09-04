import React, { ProviderProps, useEffect, useState } from "react";
import { ApiResult, AuthContext } from "./AuthContext.ts";
import { SignUpRequest } from "../../user/schemas/signUpRequestSchema.ts";
import { SignInRequest } from "../../user/schemas/signInRequest.ts";
import { Token, tokenSchema } from "../schemas/tokenSchema.ts";
import LargeSecureStore from "../../../database/connector/storage/newLargeSecureStorage.ts";
import { AxiosError } from "axios";
import { AVATAR_COLOR, BaseConfig } from "../../../constants/index.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { User, userSchema } from "../../user/schemas/userSchema.tsx";
import { getToastMessage } from "../../../ui/alert/utils/getToastMessage.ts";
import { SignInToast, SignOutToast, SignUpToast } from "../../user/presets/toast/index.ts";
import { useAlert } from "../../../ui/alert/hooks/useAlert.ts";
import { router } from "expo-router";
import { OtpVerificationHandlerType } from "../../../app/bottomSheet/otpVerification.tsx";

export function AuthProvider2({
    children
}: ProviderProps) {
    const { carlogApi } = useDatabase();
    const { openToast } = useAlert();

    const [authenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const loadToken = async () => {
            const refreshToken = await LargeSecureStore.getItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);

            if(!refreshToken) return setAuthenticated(false);

            try {
                const response = await carlogApi.post<Token>("auth/refresh", { refreshToken }, tokenSchema);
                await LargeSecureStore.setItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN, response.data.token);
                await LargeSecureStore.setItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN, response.data.refreshToken);
                setAuthenticated(!!response.data.token);
            } catch(error: AxiosError) {
                setAuthenticated(false);
            }
        };

        loadToken();
    }, []);

    const openUserVerification = (email: string) => {
        router.push({
            pathname: "bottomSheet/otpVerification",
            params: {
                type: "signup",
                title: "Email cím hitelesítés",
                email,
                handlerType: OtpVerificationHandlerType.SignUp
            }
        });
    };

    const signUp = async (request: SignUpRequest): Promise<ApiResult> => {
        try {
            const avatarColor = AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)];
            console.log("color: ", avatarColor);
            const { data } = await carlogApi.post<User>("auth/signUp", { ...request, avatarColor }, userSchema);
            console.log(data);

            router.dismissTo("auth"); //close bottom sheet

            // openUserVerification(data.email);
            // await userDAO.insertUser({
            //     id: newUser.id,
            //     email: newUser.email,
            //     firstname: newUser.user_metadata.firstname,
            //     lastname: newUser.user_metadata.lastname,
            //     avatarColor: newUser.user_metadata.avatarColor,
            //     avatarImage: newUser.user_metadata.avatarImage
            // });
        } catch(error: AxiosError) {
            console.error("Signup error: ", error);
            const toastMessage = getToastMessage({ messages: SignUpToast, error });
            openToast(toastMessage);
        }
    };

    const signIn = async (request: SignInRequest): Promise<ApiResult> => {
        try {
            const { data } = await carlogApi.post<Token>("auth/signIn", request, tokenSchema);

            await LargeSecureStore.setItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN, data.token);
            await LargeSecureStore.setItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN, data.refreshToken);
            setAuthenticated(!!data.token);

            router.dismissTo("auth");
            openToast(SignInToast.success());
        } catch(error: AxiosError) {
            console.log("signIn error:", error);
            const toastMessage = getToastMessage({ messages: SignInToast, error });
            openToast(toastMessage);
        }
    };

    const signOut = async (disabledToast?: boolean) => {
        try {
            const refreshToken = await LargeSecureStore.getItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);

            if(!refreshToken) throw new Error("Refresh token not set");

            await carlogApi.post<string>("auth/signOut", { refreshToken });

            setAuthenticated(false);

            await LargeSecureStore.removeItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);
            await LargeSecureStore.removeItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN);

            router.replace({ pathname: "/backToRootIndex", params: {} });
            if(!disabledToast) openToast(SignOutToast.success());
            // await database.disconnect();
        } catch(error: AxiosError) { console.log("SignOut error:", error); }
    };

    // const dispatch = useAppDispatch();
    // const { openToast } = useAlert();
    // const database = useDatabase();
    // const { supabaseConnector, powersync, carDAO } = database;
    //
    // const carBrandsAndModelsLoaded = useRef(false);
    // const initialSync = useRef(true);
    //
    // const user = useAppSelector(getUser);
    // const userLoading = useAppSelector(isUserLoading);
    // const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);
    //
    // const [session, setSession] = useState<Session | null>(null);
    // const [sessionLoading, setSessionLoading] = useState<boolean>(true);
    //
    // const signOut = async (disabledToast: boolean = false) => {
    //     try {
    //         const { error } =
    //             await supabaseConnector
    //             .client
    //             .auth
    //             .signOut();
    //
    //         if(error) throw error;
    //
    //         router.dismissAll();
    //         router.push("/backToRootIndex");
    //
    //         if(!disabledToast) openToast(SignOutToast.success());
    //         await database.disconnect();
    //     } catch(error) {
    //         if(error instanceof AuthError && !disabledToast) {
    //             return openToast(
    //                 getToastMessage({
    //                     messages: SignOutToast,
    //                     error
    //                 })
    //             );
    //         }
    //         // ha nem AuthError akkor sikeres a kijelentkezes, de mashol hiba tortent (pl: powersync)
    //     }
    // };
    //
    // const fetchNotVerifiedUser = async () => {
    //     const newNotVerifiedUser = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
    //     if(!newNotVerifiedUser) return;
    //
    //     setNotVerifiedUser(JSON.parse(newNotVerifiedUser));
    // };
    //
    // const updateNotVerifiedUser = async (newNotVerifiedUser: User | null) => {
    //     setNotVerifiedUser(newNotVerifiedUser);
    //
    //     if(newNotVerifiedUser) {
    //         void AsyncStorage.setItem(
    //             BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER,
    //             JSON.stringify(newNotVerifiedUser)
    //         );
    //     } else {
    //         void AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
    //     }
    // };
    //
    //
    // // adatok betoltese local db-bol
    // const fetchLocalData = async () => {
    //     if(!session || !session.user) return;
    //
    //     void updateNotVerifiedUser(null);
    //
    //     dispatch(loadUser({
    //         database,
    //         userId: session.user.id,
    //         defaultUserValue: {
    //             id: session.user.id,
    //             email: session.user.email,
    //             firstname: session.user.user_metadata.firstname,
    //             lastname: session.user.user_metadata.lastname,
    //             avatarColor: session.user.user_metadata.avatarColor,
    //             avatarImage: session.user.user_metadata.avatarImage
    //         } as UserTableType
    //     }));
    //
    //     dispatch(loadCars(database));
    // };
    //
    // useEffect(() => {
    //     supabaseConnector
    //     .client
    //     .auth
    //     .onAuthStateChange(
    //         (_event, session) => {
    //             setSession(session);
    //             if(sessionLoading) setSessionLoading(false);
    //             if(session?.user.id === notVerifiedUser?.id) setNotVerifiedUser(null);
    //         }
    //     );
    //
    //     void fetchNotVerifiedUser();
    // }, []);
    //
    // useEffect(() => {
    //     supabaseConnector
    //     .client
    //     .auth
    //     .getUser()
    //     .then(
    //         ({ data: { user } }) => {
    //             if(user) void updateNotVerifiedUser(user);
    //         }
    //     );
    //
    //     if(session && session.user) {
    //         void fetchLocalData();
    //         if(!carBrandsAndModelsLoaded.current) {
    //             carBrandsAndModelsLoaded.current = true;
    //             void initialLoadCarBrands();
    //         }
    //
    //         return powersync.registerListener({
    //             statusChanged: status => {
    //                 if(status.hasSynced && initialSync.current) {
    //                     initialSync.current = false;
    //                     void fetchLocalData();
    //                 }
    //             }
    //         });
    //     }
    // }, [session]);
    //
    // const refreshSession = async () => {
    //     const { error } =
    //         await supabaseConnector
    //         .client
    //         .auth
    //         .refreshSession();
    //
    //     if(error) console.debug("refreshError", error);
    // };

    return (
        <AuthContext.Provider
            value={ {
                authenticated,
                signUp,
                signIn,
                signOut
            } }
        >
            { children }
        </AuthContext.Provider>
    );
};