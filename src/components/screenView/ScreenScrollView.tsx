import React from "react";
import { View } from "react-native";
import { FULL_TABBAR_HEIGHT, SEPARATOR_SIZES } from "../../constants";
import Animated from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { ScreenView, ScreenViewProps } from "./ScreenView.tsx";
import { WEB_SCROLLBAR_STYLE } from "./webScrollbarStyle";
import { useDesktopWeb } from "../../hooks/useDesktopWeb";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ScreenScrollView({
    screenHasHeader = true,
    screenHasTabBar = true,
    safeAreaEdges = ["top", "bottom", "right", "left"],
    style,
    children
}: ScreenViewProps) {
    const showWebScrollbar = useDesktopWeb();
    const bottomSpacer = (screenHasTabBar ? FULL_TABBAR_HEIGHT : 0) + SEPARATOR_SIZES.lightSmall;

    return (
        <ScreenView
            safeAreaEdges={ safeAreaEdges }
            screenHasHeader={ screenHasHeader }
            screenHasTabBar={ screenHasTabBar }
            fullWidthScrollArea={ showWebScrollbar }
            style={ style }
        >
            <AnimatedScrollView
                style={ showWebScrollbar ? WEB_SCROLLBAR_STYLE : undefined }
                scrollEventThrottle={ 16 }
                showsVerticalScrollIndicator={ showWebScrollbar }
                nestedScrollEnabled
                contentContainerStyle={ { flexGrow: 1 } }
            >
                <View style={ {
                    flex: 1,
                    gap: SEPARATOR_SIZES.lightSmall,
                    width: "100%",
                    maxWidth: showWebScrollbar ? 1480 : undefined,
                    alignSelf: "center"
                } }>
                    { children }
                    <View style={ { height: bottomSpacer } }/>
                </View>
            </AnimatedScrollView>
        </ScreenView>
    );
};
