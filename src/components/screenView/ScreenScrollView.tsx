import React from "react";
import { View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../constants";
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
    return (
        <ScreenView
            safeAreaEdges={ safeAreaEdges }
            screenHasHeader={ screenHasHeader }
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
                    paddingBottom: screenHasTabBar ? SIMPLE_TABBAR_HEIGHT : 0,
                    gap: SEPARATOR_SIZES.lightSmall
                } }>
                    { children }
                </View>
            </AnimatedScrollView>
        </ScreenView>
    );
};