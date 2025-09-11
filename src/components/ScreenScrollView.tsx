import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, View, ViewStyle } from "react-native";
import { GLOBAL_STYLE, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../constants/index.ts";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { useScreenScrollView } from "../contexts/screenScrollView/ScreenScrollViewContext.ts";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenScrollViewProps {
    style?: ViewStyle,
    children?: React.ReactNode,
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export function ScreenScrollView({ style, children }: ScreenScrollViewProps) {
    const { bottom } = useSafeAreaInsets();
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
        <SafeAreaView style={ [
            GLOBAL_STYLE.pageContainer,
            style,
            { paddingBottom: bottom + GLOBAL_STYLE.pageContainer.paddingBottom }
        ] }>
            <AnimatedScrollView
                onLayout={ onLayout }
                onContentSizeChange={ onContentSizeChange }
                onScroll={ onScroll }
                scrollEventThrottle={ 16 }
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                <View style={ { flex: 1, paddingBottom: SIMPLE_TABBAR_HEIGHT, gap: SEPARATOR_SIZES.lightSmall } }>
                    { children }
                </View>
            </AnimatedScrollView>
        </SafeAreaView>
    );
};