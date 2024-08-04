import React, {useState} from "react";
import {GLOBAL_STYLE, ICON_NAMES} from "../constants/constants";
import {theme} from "../styles/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import {Alert, Text, View} from "react-native";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import RegisterForm from "../layouts/forms/RegisterForm";
import {MultiStepFormProvider} from "../providers/MultiStepFormProvider";
import {useForm} from "react-hook-form";
import {KeyboardProvider} from "react-native-keyboard-controller";
import {useDatabase} from "../db/Database";
import {
    getRegisterHandleSubmit,
    RegisterFormFieldType,
    registerUseFormProps
} from "../constants/formSchema/registerForm";
import RegisterStepOne from "../layouts/forms/RegisterForm/StepOne";
import RegisterStepTwo from "../layouts/forms/RegisterForm/StepTwo";
import RegisterStepThree from "../layouts/forms/RegisterForm/StepThree";

const RegisterScreen: React.FC = () => {
    const { supabaseConnector } = useDatabase();
    const { control, handleSubmit, trigger } =
        useForm<RegisterFormFieldType>(registerUseFormProps);

    const submitHandler = getRegisterHandleSubmit({
        handleSubmit,
        supabaseConnector
    });

    const steps = [
        () =>
            <RegisterStepOne />,
        () =>
            <RegisterStepTwo />,
        () =>
            <RegisterStepThree />
    ];

    return (
        <KeyboardProvider>
            <MultiStepFormProvider steps={ steps } control={ control } submitHandler={ submitHandler } trigger={ trigger } >
                <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground3, gap: hp(1) }] }>
                    <BackButtonHeader title="Fiók létrehozása" backButtonAction={ () => router.replace({ pathname: "/" }) } />
                    <RegisterForm />
                </View>
            </MultiStepFormProvider>
        </KeyboardProvider>
    );
}

export default RegisterScreen;