import React, { useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from "react-native-reanimated";
import { StyleSheet, TextStyle } from "react-native";
import { COLORS, FONT_SIZES } from "../constants/index.ts";

type BounceDotProps = {
    delay?: number,
    duration?: number,
    style?: TextStyle
}

const BounceDot: React.FC<BounceDotProps> = ({
    delay = 0,
    duration = 400,
    style
}) => {
    const translateY = useSharedValue(-3);

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(
                    0,
                    {
                        duration,
                        easing: Easing.inOut(Easing.quad)
                    }
                ),
                -1,
                true
            )
        );
    }, []);

    const dotStyle = useAnimatedStyle(() => {
        return ({
            transform: [{ translateY: translateY.value }]
        });
    });

    return (
        <Animated.Text style={ [dotStyle, style, styles.dot] }>
            .
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    dot: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.gray1
    }
});

export default BounceDot;