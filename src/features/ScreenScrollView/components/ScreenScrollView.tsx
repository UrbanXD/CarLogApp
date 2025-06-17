import React from "react";
import { SafeAreaView, ViewStyle } from "react-native";
import { GLOBAL_STYLE, SIMPLE_TABBAR_HEIGHT } from "../../../constants/index.ts";
import Animated, { useAnimatedScrollHandler, useSharedValue, withTiming } from "react-native-reanimated";
import { useScreenScrollView } from "../context/ScreenScrollViewProvider.tsx";

interface ScreenScrollViewProps {
    style?: ViewStyle,
    children?: React.ReactNode,
}

export const ScreenScrollView: React.FC<ScreenScrollViewProps> = ({
    style,
    children
}) => {
    const { offset} = useScreenScrollView();
    const prevOffset = useSharedValue(0);
    const SCROLL_BOUNCE_THRESHOLD = 0.25;

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            const currentOffset = event.contentOffset.y < 0 ? 0 : event.contentOffset.y;

            if(Math.abs(prevOffset.value - currentOffset) > SCROLL_BOUNCE_THRESHOLD){
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
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, style] }>
            <Animated.ScrollView
                onScroll={ onScroll }
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled={ true }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                { children }
            </Animated.ScrollView>
        </SafeAreaView>
    )
}