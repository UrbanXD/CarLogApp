import React, { useCallback } from "react";
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import {
    COLORS,
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    SEPARATOR_SIZES,
    SIMPLE_TABBAR_HEIGHT
} from "../../../constants/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useScreenScrollView } from "../../../contexts/screenScrollView/ScreenScrollViewContext.ts";
import { FloatingActionButton } from "./FloatingActionButton.tsx";
import { AnimatedPressable, AnimatedSafeAreaView } from "../../../components/AnimatedComponents/index.ts";
import { Action, ACTIONS } from "../constants/index.ts";
import { Overlay } from "../../../components/overlay/Overlay.tsx";

function FloatingActionMenu() {
    const { isScrolling } = useScreenScrollView();
    const isExpanded = useSharedValue(false);
    const titleDisplay = useSharedValue<"flex" | "none">("none");

    useAnimatedReaction(
        () => isScrolling.value,
        (scrolling) => {
            if(scrolling) isExpanded.value = false;
        }
    );

    useAnimatedReaction(
        () => isExpanded.value,
        (expanded) => {
            if(expanded) titleDisplay.value = "flex";
        }
    );

    const actionButtonIconStyle = useAnimatedStyle(() => {
        const rotateValue = withTiming(isExpanded.value ? "45deg" : "0deg");
        return {
            transform: [{ rotate: rotateValue }]
        };
    });

    const toggle = () => {
        isExpanded.value = !isExpanded.value;
    };

    const close = () => {
        isExpanded.value = false;
    };

    const renderAction = useCallback((action: Action, index: number) => {
        const handlePress = () => {
            isExpanded.value = false;
            action.onPress();
        };

        return (
            <FloatingActionButton
                key={ index }
                isMenuExpanded={ isExpanded }
                index={ index + 1 }
                icon={ action.icon }
                label={ action.label }
                onPress={ handlePress }
            />
        );
    }, []);

    return (
        <>
            <Overlay opened={ isExpanded } onPress={ close }/>
            <AnimatedSafeAreaView style={ styles.container }>
                <View style={ styles.buttonsContainer }>
                    <AnimatedPressable
                        onPress={ toggle }
                        style={ [styles.actionButton] }
                    >
                        <Animated.Text style={ [styles.actionButton.icon, actionButtonIconStyle] }>+</Animated.Text>
                    </AnimatedPressable>
                    { ACTIONS.map(renderAction) }
                </View>
            </AnimatedSafeAreaView>
        </>
    );
}

export default FloatingActionMenu;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: SIMPLE_TABBAR_HEIGHT + SEPARATOR_SIZES.normal,
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