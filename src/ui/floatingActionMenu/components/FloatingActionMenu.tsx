import React from "react";
import Animated, {
    interpolate,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { Pressable, StyleSheet, View } from "react-native";
import {
    COLORS,
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    ICON_NAMES,
    SEPARATOR_SIZES,
    SIMPLE_TABBAR_HEIGHT
} from "../../../constants/index.ts";
import { SafeAreaView } from "react-native-safe-area-context";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useScreenScrollView } from "../../../contexts/screenScrollView/ScreenScrollViewContext.ts";
import { FloatingActionButton } from "./FloatingActionButton.tsx";
import { router } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {
    duration: 1200,
    overshootClamping: true,
    dampingRatio: 0.8
};

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

function FloatingActionMenu() {
    const { isScrolling } = useScreenScrollView();
    const isExpanded = useSharedValue(false);
    const isAnimating = useSharedValue(false);
    const overlayDisplay = useSharedValue<"flex" | "none">("none");
    const titleDisplay = useSharedValue<"flex" | "none">("none");

    useAnimatedReaction(
        () => isScrolling.value,
        (scrolling) => {
            if(scrolling) isExpanded.value = false;
        }
    );

    const overlayStyle = useAnimatedStyle(() => {
        const opacity = withTiming(
            isExpanded.value ? 0.525 : 0,
            { duration: 400 },
            (finished) => {
                if(finished) {
                    isAnimating.value = false;
                    overlayDisplay.value = isExpanded.value ? "flex" : "none";
                }
            }
        );

        return { opacity, display: overlayDisplay.value };
    });

    const actionButtonStyle = useAnimatedStyle(() => {
        const width = withSpring(
            interpolate(Number(isExpanded.value), [0, 1], [56, 250]),
            SPRING_CONFIG
        );
        return { width };
    });

    const actionButtonIconStyle = useAnimatedStyle(() => {
        const rotateValue = withTiming(isExpanded.value ? "45deg" : "0deg");
        return {
            transform: [{ rotate: rotateValue }]
        };
    });

    const actionButtonTitleStyle = useAnimatedStyle(() => {
        const opacity = withTiming(isExpanded.value ? 1 : 0, { duration: 250 }, (finished) => {
            if(finished) titleDisplay.value = isExpanded.value ? "flex" : "none";
        });
        const display = titleDisplay.value;

        return { opacity, display };
    });

    const toggle = () => {
        if(isAnimating.value) return;
        isAnimating.value = true;

        const expanded = !isExpanded.value;
        isExpanded.value = expanded;

        if(expanded) overlayDisplay.value = "flex";
        if(expanded) titleDisplay.value = "flex";
    };

    const close = () => {
        if(isAnimating.value) return;

        isExpanded.value = false;
    };
    const openNewCarForm = () => router.push("bottomSheet/createCar");

    return (
        <>
            <AnimatedPressable
                onPress={ close }
                style={ [
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: COLORS.black, zIndex: 2 },
                    overlayStyle
                ] }
            />
            <AnimatedSafeAreaView style={ styles.container }>
                <View style={ styles.buttonsContainer }>
                    <AnimatedPressable
                        onPress={ toggle }
                        style={ [styles.actionButton] }
                    >
                        <Animated.Text style={ [styles.actionButton.icon, actionButtonIconStyle] }>
                            +
                        </Animated.Text>
                        {/*<Animated.Text*/ }
                        {/*    style={ [styles.actionButton.title, actionButtonTitleStyle] }>Gyors Elérés</Animated.Text>*/ }
                    </AnimatedPressable>
                    <FloatingActionButton
                        isMenuExpanded={ isExpanded }
                        index={ 1 }
                        icon={ ICON_NAMES.car }
                        label="Autó létrehozás"
                        onPress={ openNewCarForm }
                    />
                    <FloatingActionButton
                        isMenuExpanded={ isExpanded }
                        index={ 2 }
                        icon={ ICON_NAMES.serviceOutline }
                        label="Szervizelés"
                    />
                    <FloatingActionButton
                        isMenuExpanded={ isExpanded }
                        index={ 3 }
                        icon={ ICON_NAMES.fuelPump }
                        label="Tankolás"
                    />
                    <FloatingActionButton
                        isMenuExpanded={ isExpanded }
                        index={ 4 }
                        icon={ ICON_NAMES.receipt }
                        label="Egyéb kiadások"
                    />
                    <FloatingActionButton
                        isMenuExpanded={ isExpanded }
                        index={ 5 }
                        icon={ ICON_NAMES.road }
                        label="Út tervezés"
                    />
                </View>
            </AnimatedSafeAreaView>
        </>
    );
}

export default FloatingActionMenu;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: SIMPLE_TABBAR_HEIGHT + SEPARATOR_SIZES.small,
        right: DEFAULT_SEPARATOR,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        zIndex: 2
    },
    buttonsContainer: {
        position: "absolute",
        width: "100%",
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-end"
    },
    actionButton: {
        zIndex: 1,
        height: heightPercentageToDP(6),
        width: heightPercentageToDP(6),
        borderRadius: 100,
        backgroundColor: COLORS.fuelYellow,
        borderColor: COLORS.black2,
        borderWidth: 0.5,
        display: "flex",
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",

        title: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p1,
            color: COLORS.black
        },

        icon: {
            fontSize: FONT_SIZES.h1,
            lineHeight: 45,
            color: COLORS.black
        }
    }
});