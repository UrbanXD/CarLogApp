import React, { ProviderProps, useEffect, useRef, useState } from "react";
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
import { useAppDispatch } from "../../../hooks/index.ts";
import { loadUser } from "../../user/model/actions/loadUser.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function AuthProvider({
    children
}: ProviderProps) {
    const dispatch = useAppDispatch();
    const database = useDatabase();
    const { carlogApi, powersync } = database;
    const { openToast } = useAlert();

    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const initialSync = useRef(true);

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
                await signOut(true);
            }
        };

        loadToken();
    }, []);

    useEffect(() => {
        if(!authenticated) return;

        setNotVerifiedUser(null);
        dispatch(loadUser({ database, userId: "2aec9550-6bde-4ff5-89fb-bed486db5012" }));  //only for testing
        // dispatch(loadCars(database));

        return powersync.registerListener({
            statusChanged: status => {
                if(status.hasSynced && initialSync.current) {
                    initialSync.current = false;
                    setNotVerifiedUser(null);
                    dispatch(loadUser({ database, userId: "2aec9550-6bde-4ff5-89fb-bed486db5012" }));  //only for testing
                }
            }
        });
    }, [authenticated]);

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
        const refreshToken = await LargeSecureStore.getItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);

        setAuthenticated(false);

        await LargeSecureStore.removeItem(BaseConfig.SECURE_STORAGE_KEY_REFRESH_TOKEN);
        await LargeSecureStore.removeItem(BaseConfig.SECURE_STORAGE_KEY_TOKEN);

        router.replace({ pathname: "/backToRootIndex", params: {} });
        if(!disabledToast) openToast(SignOutToast.success());

        if(!refreshToken) return;

        try {
            await carlogApi.post<string>("auth/signOut", { refreshToken }); // handle refresh token delete from db
        } catch(error: AxiosError) {
            console.log("SignOut error (removing refresh token from db) :", error);
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

    return (
        <AuthContext.Provider
            value={ {
                authenticated,
                notVerifiedUser,
                signUp,
                signIn,
                signOut
            } }
        >
            { children }
        </AuthContext.Provider>
    );
};