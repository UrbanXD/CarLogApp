import React from "react";
import { View } from "react-native";
import { FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../../constants";
import Animated from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { ScreenView, ScreenViewProps } from "./ScreenView.tsx";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ScreenScrollView({
    screenHasHeader = true,
    screenHasTabBar = true,
    safeAreaEdges = ["top", "bottom", "right", "left"],
    style,
    children
}: ScreenViewProps) {
    const bottomSpacer = (screenHasTabBar ? FULL_TABBAR_HEIGHT : 0) + SEPARATOR_SIZES.lightSmall;

    return (
        <ScreenView
            safeAreaEdges={ safeAreaEdges }
            screenHasHeader={ screenHasHeader }
            screenHasTabBar={ screenHasTabBar }
            style={ style }
        >
            <AnimatedScrollView
                scrollEventThrottle={ 16 }
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled
                contentContainerStyle={ { flexGrow: 1 } }
            >
                <View style={ {
                    flex: 1,
                    gap: SEPARATOR_SIZES.lightSmall
                } }>
                    { children }
                    <View style={ { height: bottomSpacer } }/>
                </View>
            </AnimatedScrollView>
        </ScreenView>
    );
};