import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import {
    COLORS,
    DEFAULT_SEPARATOR,
    SEPARATOR_SIZES,
    SIMPLE_HEADER_HEIGHT,
    SIMPLE_TABBAR_HEIGHT
} from "../constants/index.ts";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { useScreenScrollView } from "../contexts/screenScrollView/ScreenScrollViewContext.ts";
import { Edges, SafeAreaView } from "react-native-safe-area-context";

type ScreenScrollViewProps = {
    screenHasHeader?: boolean,
    screenHasTabBar?: boolean,
    safeAreaEdges?: Edges,
    style?: ViewStyle,
    children?: React.ReactNode,
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ScreenScrollView({
    screenHasHeader = true,
    screenHasTabBar = true,
    safeAreaEdges = ["top", "bottom", "right", "left"],
    style,
    children
}: ScreenScrollViewProps) {
    const { y, distanceFromBottom, scrollDirection, isScrolling } = useScreenScrollView();

    const prevOffset = useSharedValue(0);
    const scrollTimeout = useSharedValue(null);

    const [layoutHeight, setLayoutHeight] = useState(0);

    const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
        setLayoutHeight(nativeEvent.layout.height);
    }, []);

    const onContentSizeChange = useCallback((_width: number, height: number) => {
        distanceFromBottom.value = Math.max(0, height - layoutHeight);
    }, []);

    const onScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            isScrolling.value = true;
            if(scrollTimeout.value) clearTimeout(scrollTimeout.value);
        },
        onScroll: ({ contentOffset, contentSize, layoutMeasurement }) => {
            if(prevOffset.value < contentOffset.y) {
                scrollDirection.value = "up";
            } else {
                scrollDirection.value = "down";
            }

            y.value = contentOffset.y;
            prevOffset.value = contentOffset.y;

            distanceFromBottom.value = Math.max(0, contentSize.height - (contentOffset.y + layoutMeasurement.height));
        },
        onEndDrag: () => {
            if(scrollTimeout.value) clearTimeout(scrollTimeout.value);
            scrollTimeout.value = setTimeout(() => isScrolling.value = false, 150);
        }
    });

    return (
        <SafeAreaView
            edges={ safeAreaEdges }
            style={ [
                {
                    flex: 1,
                    paddingTop: (screenHasHeader && SIMPLE_HEADER_HEIGHT) + SEPARATOR_SIZES.lightSmall,
                    paddingHorizontal: DEFAULT_SEPARATOR,
                    paddingBottom: SEPARATOR_SIZES.lightSmall,
                    backgroundColor: COLORS.black2
                },
                style
            ] }>
            <AnimatedScrollView
                onLayout={ onLayout }
                onContentSizeChange={ onContentSizeChange }
                onScroll={ onScroll }
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
        </SafeAreaView>
    );
};