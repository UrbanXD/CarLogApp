import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../constants/index.ts";
import { Href, router } from "expo-router";
import CarlogTitle from "../components/CarlogTitle.tsx";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type AnimatedSplashScreenProps = {
    loaded: boolean,
    redirectTo: Href
}

const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ loaded, redirectTo }) => {
    const TOP_IN_AUTH_SCREEN = -SEPARATOR_SIZES.lightLarge;
    const DURATION = 300;

    const top = useSharedValue(0);

    const redirectToAuthAnimation = (callback?: () => void) => {
        "worklet";
        top.value = withTiming(
            TOP_IN_AUTH_SCREEN,
            { duration: DURATION, easing: Easing.linear },
            finished => {
                if(finished && callback) callback();
            }
        );
    };

    const onAnimationFinished = () => {
        "worklet";
        if(redirectTo === "/auth") {
            redirectToAuthAnimation(() => scheduleOnRN(router.replace, redirectTo));
        } else {
            scheduleOnRN(router.replace, redirectTo);
        }
    };

    const titleContainerStyle = useAnimatedStyle(() => {
        return {
            flex: 1,
            top: top.value
        };
    });

    return (
        <SafeAreaView style={ styles.container }>
            <View style={ { flex: 1 } }/>
            <Animated.View style={ titleContainerStyle }>
                <CarlogTitle onAnimationFinished={ onAnimationFinished }/>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.black2,
        paddingHorizontal: DEFAULT_SEPARATOR,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default AnimatedSplashScreen;