import React, { ReactNode, useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, type ViewStyle } from "react-native";
import Animated, { useAnimatedReaction, useFrameCallback, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { MeasureElement } from "./helper/MeasureElement.tsx";
import { Cloner } from "./helper/Cloner.tsx";

export type MarqueeProps = {
    children: ReactNode
    speed?: number
    spacing?: number
    style?: ViewStyle
}

function FMarquee({ children, speed = 1, spacing = 0, style }: MarqueeProps) {
    const parentWidth = useSharedValue(0);
    const childWidth = useSharedValue(0);
    const position = useSharedValue(0);

    const [cloneTimes, setCloneTimes] = useState(0);

    useFrameCallback(() => position.value += speed, true);

    useAnimatedReaction(
        () => {
            if(childWidth.value === 0 || parentWidth.value === 0) return 0;

            return Math.round(parentWidth.value / childWidth.value) + 1;
        },
        (value) => {
            if(value === 0) return;

            scheduleOnRN(setCloneTimes, value * 2);
        }
    );

    const parentOnLayout = useCallback((event: LayoutChangeEvent) => {
        parentWidth.value = event.nativeEvent.layout.width;
    }, []);

    const childOnLayout = useCallback((width: number) => {
        childWidth.value = width;
    }, []);

    return (
        <Animated.View
            style={ style }
            onLayout={ parentOnLayout }
            pointerEvents="box-none"
        >
            <Animated.View style={ styles.row } pointerEvents="box-none">
                <MeasureElement
                    children={ children }
                    onLayout={ childOnLayout }
                />
                <Cloner
                    times={ cloneTimes }
                    children={ children }
                    position={ position }
                    width={ childWidth }
                    spacing={ spacing }
                />
            </Animated.View>
        </Animated.View>
    );
}

export const Marquee = React.memo(FMarquee);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        overflow: "hidden"
    }
});