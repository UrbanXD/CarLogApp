import React from "react";
import {StatusBar} from "expo-status-bar";
import {Text, View} from "react-native";
import {Redirect, router, useRootNavigationState} from "expo-router";
import {GLOBAL_STYLE} from "../../constants/constants";
import {theme} from "../../styles/theme";
import BackButtonHeader from "../../layouts/header/BackButtonHeader";
import RegisterScreen from "../../screens/RegisterScreen";

const Page: React.FC = () => {
    return (
        <>
            <StatusBar style="light" />
            <RegisterScreen />
        </>
    );
}

export default Page;