import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../constants/index.ts";
import { Href } from "expo-router";
import CarlogTitle from "../components/CarlogTitle.tsx";

type AnimatedSplashScreenProps = {
    loaded: boolean,
    redirectTo: Href
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ loaded, redirectTo }) => {
    return (
        <SafeAreaView style={ styles.container }>
            <View style={ { flex: 1 } }/>
            <View style={ styles.titleContainer }>
                <CarlogTitle
                    loaded={ loaded }
                    redirectTo={ redirectTo }
                    animated
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black2,
        paddingHorizontal: DEFAULT_SEPARATOR
    },
    titleContainer: {
        flex: 1,
        top: -SEPARATOR_SIZES.lightLarge
    }
});

export default AnimatedSplashScreen;