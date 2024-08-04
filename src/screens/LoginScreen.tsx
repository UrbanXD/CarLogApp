import React, {useEffect, useState} from "react";
import {GLOBAL_STYLE} from "../constants/constants";
import {theme} from "../styles/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import { View } from "react-native";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import LoginForm from "../layouts/forms/LoginForm";
import {KeyboardProvider} from "react-native-keyboard-controller";

const LoginScreen: React.FC = () => {
    return (
            <KeyboardProvider>
                <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground3, gap: hp(6.5) }] }>
                    <BackButtonHeader title={"Bejelentkezés"} backButtonAction={ () => router.replace({ pathname: "/" }) } />
                    <LoginForm />
                </View>
            </KeyboardProvider>
    )
}

export default LoginScreen;