import React, { ProviderProps, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import { useDatabase } from "../database/DatabaseContext.ts";
import { AuthError, GenerateLinkParams, Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AVATAR_COLOR, BaseConfig } from "../../constants/index.ts";
import { router } from "expo-router";
import { DeleteUserToast, SignInToast, SignOutToast, SignUpToast } from "../../features/user/presets/toast/index.ts";
import { getToastMessage } from "../../ui/alert/utils/getToastMessage.ts";
import { useAlert } from "../../ui/alert/hooks/useAlert.ts";
import { SignInRequest } from "../../features/user/schemas/form/signInRequest.ts";
import { SignUpRequest } from "../../features/user/schemas/form/signUpRequest.ts";
import { deleteCars, updateCars } from "../../features/car/model/slice/index.ts";
import { updateUser } from "../../features/user/model/slice/index.ts";
import { getUserLocalCurrency } from "../../features/_shared/currency/utils/getUserLocalCurrency.ts";
import { useTranslation } from "react-i18next";
import { OtpVerificationHandlerType } from "../../features/user/hooks/useOtpVerificationHandler.ts";
import { CAR_TABLE } from "../../database/connector/powersync/tables/car.ts";
import { DiffTriggerOperation, sanitizeSQL, sanitizeUUID } from "@powersync/react-native";
import { USER_TABLE } from "../../database/connector/powersync/tables/user.ts";
import { selectCar } from "../../features/car/model/actions/selectCar.ts";
import { Directory } from "expo-file-system";
import { INPUT_IMAGE_TEMP_DIR } from "../../components/Input/imagePicker/InputImagePicker.tsx";

export const AuthProvider: React.FC<ProviderProps<unknown>> = ({
    children
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const database = useDatabase();
    const { supabaseConnector, powersync, attachmentQueue, userDao, carDao } = database;

    const [session, setSession] = useState<Session | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const [notVerifiedEmail, setNotVerifiedEmail] = useState<string | null>(null);

    useEffect(() => {
        database.init();

        const { data: authListener } = supabaseConnector.client.auth.onAuthStateChange(
            (event, supabaseSession) => {
                if(event === "PASSWORD_RECOVERY") return;

                if(!supabaseSession) {
                    if(router.canDismiss()) router.dismissAll();
                    router.replace("/backToRootIndex");
                }

                setAuthenticated(!!supabaseSession);
                setSession(supabaseSession);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if(!session) fetchNotVerifiedEmail();
        if(session?.user?.email === notVerifiedEmail) setNotVerifiedEmail(null);

        if(!session?.user.id) return;
        const userId = session.user.id;

        let unsubscribeUserTrigger;
        let unsubscribeCarsTrigger;

        const initTriggers = async () => {
            await database.waitForInit();
            await powersync.waitForReady();
            await powersync.waitForFirstSync();

            unsubscribeUserTrigger = await powersync.triggers.trackTableDiff({
                source: USER_TABLE,
                when: {
                    [DiffTriggerOperation.INSERT]: sanitizeSQL`NEW.id = ${ sanitizeUUID(userId) }`,
                    [DiffTriggerOperation.UPDATE]: sanitizeSQL`NEW.id = ${ sanitizeUUID(userId) }`,
                    [DiffTriggerOperation.DELETE]: sanitizeSQL`OLD.id = ${ sanitizeUUID(userId) }`
                },
                onChange: async (context) => {
                    const newUser = (await context.withDiff(`
                        SELECT ${ USER_TABLE }.*
                        FROM DIFF
                                 JOIN ${ USER_TABLE } ON DIFF.id = ${ USER_TABLE }.id
                        WHERE DIFF.id = '${ userId }'
                    `))?.[0] ?? null;

                    dispatch(updateUser({ user: newUser ? await userDao.mapper.toDto(newUser) : null }));
                },
                hooks: {
                    beforeCreate: async (lockContext) => {
                        const res = await lockContext.getOptional(`
                            SELECT *
                            FROM ${ USER_TABLE }
                            WHERE id = '${ userId }'
                        `);

                        if(res) dispatch(updateUser({ user: await database.userDao.mapper.toDto(res) }));
                    }
                }
            });

            unsubscribeCarsTrigger = await powersync.triggers.trackTableDiff({
                source: CAR_TABLE,
                when: {
                    [DiffTriggerOperation.INSERT]: sanitizeSQL`json_extract(NEW.data, '$.owner_id') = ${ sanitizeUUID(
                        userId) }`,
                    [DiffTriggerOperation.UPDATE]: sanitizeSQL`json_extract(NEW.data, '$.owner_id') = ${ sanitizeUUID(
                        userId) }`,
                    [DiffTriggerOperation.DELETE]: sanitizeSQL`json_extract(OLD.data, '$.owner_id') = ${ sanitizeUUID(
                        userId) }`
                },
                onChange: async (context) => {
                    const updatedDiffResult = await context.withDiff(`
                        SELECT ${ CAR_TABLE }.*
                        FROM DIFF
                                 JOIN ${ CAR_TABLE } ON DIFF.id = ${ CAR_TABLE }.id
                        WHERE ${ CAR_TABLE }.owner_id = '${ userId }'
                          AND operation != '${ DiffTriggerOperation.DELETE }'
                    `);

                    const deletedDiffResult = await context.withDiff(`
                        SELECT DIFF.id
                        FROM DIFF
                        WHERE operation = '${ DiffTriggerOperation.DELETE }'
                    `);

                    console.log(updatedDiffResult, "\n\n", deletedDiffResult);

                    if(deletedDiffResult.length > 0) {
                        dispatch(deleteCars({
                            carIds: deletedDiffResult.map(res => res.id)
                        }));
                    }

                    if(updatedDiffResult.length > 0) {
                        dispatch(updateCars({ cars: await carDao.mapper.toDtoArray(updatedDiffResult) }));
                    }
                },
                hooks: {
                    beforeCreate: async (lockContext) => {
                        const result = await lockContext.getAll(`
                            SELECT *
                            FROM ${ CAR_TABLE } AS t1
                            WHERE t1.owner_id = '${ userId }'
                            ORDER BY t1.created_at
                        `);

                        const cars = await database.carDao.mapper.toDtoArray(result);
                        dispatch(updateCars({ cars, shouldReplace: true }));
                        const selectedCarId = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_SELECTED_CAR_INDEX);
                        if(selectedCarId) dispatch(selectCar({ database, carId: selectedCarId }));
                    }
                }
            });
        };

        initTriggers();
        if(attachmentQueue) attachmentQueue.cleanUpLocalFiles(userId);
        const inputImageTempDirectory = new Directory(INPUT_IMAGE_TEMP_DIR);
        if(inputImageTempDirectory.exists) inputImageTempDirectory.delete();

        return () => {
            if(unsubscribeUserTrigger) unsubscribeUserTrigger();
            if(unsubscribeCarsTrigger) unsubscribeCarsTrigger();
        };
    }, [session?.user.id]);

    const openAccountVerification = (email: string, automaticResend?: boolean = false) => {
        router.push({
            pathname: "bottomSheet/otpVerification",
            params: {
                type: "signup",
                title: t("auth.otp_verification.email"),
                email,
                handlerType: OtpVerificationHandlerType.SignUp,
                automaticResend: automaticResend
            }
        });
    };

    const signUp = async (request: SignUpRequest): Promise<ApiResult> => {
        try {
            const {
                data: emailExists,
                error: emailError
            } = await supabaseConnector.client.rpc("email_exists", { email_address: request.email });

            if(emailError) throw emailError;
            if(emailExists) throw { code: "email_exists" } as AuthError;

            const avatarColor = AVATAR_COLOR[Math.floor(Math.random() * AVATAR_COLOR.length)];
            const { data: { user: supabaseUser }, error } = await supabaseConnector.client.auth.signUp({
                email: request.email,
                password: request.password,
                options: {
                    data: {
                        firstname: request.firstname,
                        lastname: request.lastname,
                        avatar_color: avatarColor,
                        currency_id: getUserLocalCurrency()
                    }
                }
            });

            if(error) throw error;
            if(!supabaseUser) throw { code: "user_not_found" } as AuthError;

            updateNotVerifiedEmail(supabaseUser.email).catch(console.error);

            openAccountVerification(supabaseUser.email);
            await userDao.create({
                id: supabaseUser.id,
                email: supabaseUser.email,
                firstname: supabaseUser.user_metadata.firstname,
                lastname: supabaseUser.user_metadata.lastname,
                currency_id: getUserLocalCurrency(),
                avatar_url: null,
                avatar_color: supabaseUser.user_metadata.avatar_color
            });
        } catch(error) {
            console.error("Signup error: ", error);
            const toastMessage = getToastMessage({ messages: SignUpToast, error });
            openToast(toastMessage);
        }
    };

    const signIn = async (request: SignInRequest) => {
        const { error } = await supabaseConnector.client.auth.signInWithPassword({
            email: request.email,
            password: request.password
        });

        if(!error) {
            router.dismissTo("/backToRootIndex");
            openToast(SignInToast.success());
            return;
        }

        if(error.code === "email_not_confirmed") return openAccountVerification(request.email, true);

        if(notVerifiedEmail === request.email) updateNotVerifiedEmail(null).catch(console.error);

        console.log("signIn error:", error);
        const toastMessage = getToastMessage({ messages: SignInToast, error });
        openToast(toastMessage);
    };

    const signOut = async (disabledToast: boolean = false) => {
        try {
            if(!session) return;

            const { error } = await supabaseConnector.client.auth.signOut();

            if(error) throw error;

            if(!disabledToast) openToast(SignOutToast.success());
            await database.disconnect();
        } catch(error) {
            if(disabledToast || !(error instanceof AuthError)) return; // if not auth error just skip
            openToast(getToastMessage({ messages: SignOutToast, error }));
        }
    };

    const deleteAccount = async () => {
        try {
            if(!session?.user) throw { code: "session_not_found" };

            const emailParams: GenerateLinkParams = { type: "magiclink", email: session.user.email };

            const { error } = await supabaseConnector.client.functions.invoke(
                "generate-email",
                {
                    method: "POST",
                    body: JSON.stringify(emailParams)
                }
            );

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "magiclink", // magiclink viselkedik ugy mint ha torlest verifyolna *mivel supabasebe nincs implementalva ez meg*
                    title: t("auth.otp_verification.delete_account"),
                    email: emailParams.email,
                    userId: session?.user.id,
                    handlerType: OtpVerificationHandlerType.UserDelete
                }
            });
        } catch(error) {
            console.log(error);
            openToast(getToastMessage({ messages: DeleteUserToast, error }));
        }
    };

    const fetchNotVerifiedEmail = async () => {
        const newNotVerifiedEmail = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL);
        if(!newNotVerifiedEmail) return;

        setNotVerifiedEmail(newNotVerifiedEmail);
    };

    const updateNotVerifiedEmail = async (newNotVerifiedEmail: string | null) => {
        setNotVerifiedEmail(newNotVerifiedEmail);

        if(newNotVerifiedEmail) {
            await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL, newNotVerifiedEmail);
        } else {
            await AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_EMAIL);
        }
    };

    const refreshSession = async () => {
        const { error } = await supabaseConnector.client.auth.refreshSession();

        if(error) console.log("refreshError", error);
    };

    const value = useMemo(
        () => {
            const hasPassword = !!session?.user.user_metadata?.has_password;
            const providers: Array<string> =
                session?.user.user_metadata?.providers ??
                (session?.user.user_metadata?.provider ? [session.user.user_metadata.provider] : []);

            return {
                authenticated: authenticated,
                hasPassword,
                providers,
                openAccountVerification,
                signUp,
                signIn,
                signOut,
                deleteAccount,
                refreshSession,
                notVerifiedEmail: notVerifiedEmail,
                updateNotVerifiedEmail
            };
        },
        [
            session,
            authenticated,
            openAccountVerification,
            signUp,
            signIn,
            signOut,
            deleteAccount,
            refreshSession,
            notVerifiedEmail,
            updateNotVerifiedEmail
        ]
    );

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
};