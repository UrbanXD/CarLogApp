import React from "react";
import { View, ViewStyle } from "react-native";
import { GLOBAL_STYLE, SIMPLE_TABBAR_HEIGHT } from "../constants/index.ts";
import Animated, { useAnimatedScrollHandler, useSharedValue, withTiming } from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { useScreenScrollView } from "../contexts/screenScrollView/ScreenScrollViewContext.ts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenScrollViewProps {
    style?: ViewStyle,
    children?: React.ReactNode,
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
    style,
    children
}) => {
    const { bottom } = useSafeAreaInsets();
    const { offset } = useScreenScrollView();
    const prevOffset = useSharedValue(0);
    const SCROLL_BOUNCE_THRESHOLD = 0.25;

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            const currentOffset = event.contentOffset.y < 0 ? 0 : event.contentOffset.y;

            if(Math.abs(prevOffset.value - currentOffset) > SCROLL_BOUNCE_THRESHOLD) {
                offset.value = withTiming(
                    currentOffset < prevOffset.value
                    ? 0
                    : SIMPLE_TABBAR_HEIGHT * 2,
                    { duration: 300 }
                );
            }
            prevOffset.value = currentOffset;
        }
    }, []);

    return (
        <View style={ [
            GLOBAL_STYLE.pageContainer,
            style,
            { paddingBottom: bottom + GLOBAL_STYLE.pageContainer.paddingBottom }
        ] }>
            <AnimatedScrollView
                onScroll={ onScroll }
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                { children }
            </AnimatedScrollView>
        </View>
    );
};