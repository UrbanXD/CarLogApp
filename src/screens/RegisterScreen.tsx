import React from "react";
import {GLOBAL_STYLE} from "../constants/constants";
import {theme} from "../styles/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import {Text, View} from "react-native";

const RegisterScreen: React.FC = () => {
    return (
        <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground3 }] }>
            <BackButtonHeader title="Regisztráció" backButtonAction={ () => router.replace({ pathname: "/" }) } />
            <Text style={{color: "white"}}>Register</Text>
        </View>
    );
}

export default RegisterScreen;