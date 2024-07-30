import React, {useEffect, useState} from "react";
import {GLOBAL_STYLE} from "../constants/constants";
import {theme} from "../styles/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import {Text, View} from "react-native";
import MultiStepForm from "../components/MultiStepForm/MultiStepForm";
import Step1Screen from "./[Login]/1StepScreen";
import Step2Screen from "./[Login]/2StepScreen";
import {heightPercentageToDP} from "react-native-responsive-screen";

const LoginScreen: React.FC = () => {
    const steps = [
        () => <Step1Screen />,
        () => <Step2Screen />,
        () => <Step1Screen />,
        () => <Step2Screen />,
        () => <Step1Screen />
    ];
    return (
        <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground3, gap: heightPercentageToDP(10) }] }>
            <BackButtonHeader title={"Bejelentkezés"} backButtonAction={ () => router.replace({ pathname: "/" }) } />
            {/*<MultiStepForm steps={ steps } />*/}
            <Step1Screen>

            </Step1Screen>
        </View>
    )
}

export default LoginScreen;