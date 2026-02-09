import React, { ReactNode, useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, { useAnimatedReaction, useFrameCallback, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { MeasureElement } from "./helper/MeasureElement.tsx";
import { Cloner } from "./helper/Cloner.tsx";
import { ViewStyle } from "../../types/index.ts";

export type MarqueeProps = {
    children: ReactNode
    speed?: number
    delay?: number
    bounceDelay?: number
    spacing?: number
    style?: ViewStyle
}

function FMarquee({
    children,
    speed = 1,
    delay = 0,
    bounceDelay = 0,
    spacing = 0,
    style
}: MarqueeProps) {
    const parentWidth = useSharedValue(0);
    const childWidth = useSharedValue(0);
    const position = useSharedValue(0);
    const direction = useSharedValue(1);
    const lastRoundStartedAt = useSharedValue(Date.now());
    const round = useSharedValue(1);

    const [cloneTimes, setCloneTimes] = useState(0);

    useFrameCallback(() => {
        const now = Date.now();
        const notVisiablePartWidth = parentWidth.value - childWidth.value;
        const bounceMode = Math.abs(notVisiablePartWidth) <= (childWidth.value / 6);

        if(bounceMode) {
            if(now - lastRoundStartedAt.value < bounceDelay) return;

            position.value += speed * direction.value;

            if(direction.value > 0 && position.value > -notVisiablePartWidth) {
                direction.value = -1;
                lastRoundStartedAt.value = now;
            }

            if(direction.value < 0 && position.value < 0) {
                direction.value = 1;
                lastRoundStartedAt.value = now;
            }

            return;
        }

        if(now - lastRoundStartedAt.value < delay) return;

        const childrenWidth = ((cloneTimes - 1) * childWidth.value) + ((cloneTimes - 1) * spacing);
        if(position.value > (childrenWidth * round.value) - spacing / 4) {
            lastRoundStartedAt.value = now;
            round.value += 1;
        }

        position.value += speed;
    }, true);

    useAnimatedReaction(
        () => {
            if(childWidth.value === 0 || parentWidth.value === 0) return 0;
            return Math.ceil(parentWidth.value / childWidth.value);
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