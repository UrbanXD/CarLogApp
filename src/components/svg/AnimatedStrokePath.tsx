import React, { Component, useRef } from "react";
import { AnimatedPath } from "../AnimatedComponents/index.ts";
import { PathProps } from "react-native-svg";
import { COLORS } from "../../constants/index.ts";
import {
    AnimatedProps,
    Easing,
    interpolate,
    useAnimatedProps,
    useAnimatedReaction,
    useSharedValue,
    withDelay,
    withTiming
} from "react-native-reanimated";

type AnimatedStrokePath = {
    disabled: boolean
    pathProps: PathProps
    delay?: number
    onAnimateFinish?: () => void
    onAnimationProgress?: (visiblePartWidth: number) => void
}

const AnimatedStrokePath: React.FC<AnimatedStrokePath> = ({
    disabled,
    pathProps,
    delay = 0,
    onAnimateFinish,
    onAnimationProgress
}) => {
    const ref = useRef<Component<AnimatedProps<any>>>(null);

    const DURATION = 1000;
    const DEFAULT_STROKE_DASH_ARRAY = Number.MAX_SAFE_INTEGER; //minnel nagyobb annal jobb, mivel az elejen beugrana a teljes ha ez nincs

    const progress = useSharedValue(0);
    const strokeDashArray = useSharedValue(DEFAULT_STROKE_DASH_ARRAY);

    useAnimatedReaction(
        () => progress.value,
        (current, previous) => {
            if(current === 0 || !onAnimationProgress || current === DEFAULT_STROKE_DASH_ARRAY || previous == null) return;

            const currentVisibleWidth = interpolate(
                strokeDashArray.value - strokeDashArray.value * current,
                [0, strokeDashArray.value],
                [strokeDashArray.value, 0]
            );

            const prevVisibleWidth = interpolate(
                strokeDashArray.value - strokeDashArray.value * previous,
                [0, strokeDashArray.value],
                [strokeDashArray.value, 0]
            );

            const delta = currentVisibleWidth - prevVisibleWidth;
            onAnimationProgress(delta);
        }
    );

    const onLayout = () => {
        if(disabled) return strokeDashArray.value = 0;
        strokeDashArray.value = (ref.current as any)?.getTotalLength?.() ?? DEFAULT_STROKE_DASH_ARRAY;

        progress.value = withDelay(
            delay,
            withTiming(
                1,
                {
                    duration: DURATION,
                    easing: Easing.linear
                },
                finished => {
                    if(onAnimateFinish && finished) onAnimateFinish();
                }
            )
        );
    };

    const animatedProps = useAnimatedProps(() => {
        let fillOpacity = 1;
        let strokeDashoffset = 0;
        let strokeDasharray = 0;
        if(!disabled) {
            fillOpacity = interpolate(
                progress.value,
                [0, 0.9, 1],
                [0, 0, 1]
            );

            strokeDashoffset = strokeDashArray.value - strokeDashArray.value * progress.value;
            strokeDasharray = strokeDashArray.value;
        }
        return {
            strokeDashoffset,
            strokeDasharray,
            fillOpacity
        };
    });

    return (
        <AnimatedPath
            ref={ ref }
            onLayout={ onLayout }
            animatedProps={ animatedProps }
            stroke={ COLORS.white }
            strokeWidth={ 1.25 }
            fill={ COLORS.white }
            { ...pathProps }
        />
    );
};

export default AnimatedStrokePath;