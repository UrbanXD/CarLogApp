import Animated, {
    SharedValue,
    useAnimatedStyle,
    useDerivedValue,
    withDelay,
    withSpring,
    withTiming
} from "react-native-reanimated";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AnimatedPressable } from "../../../components/AnimatedComponents/index.ts";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Icon from "../../../components/Icon.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

const SPRING_CONFIG = {
    duration: 1100,
    overshootClamping: true,
    dampingRatio: 0.8
};

const BUTTON_SIZE = heightPercentageToDP(5.5);

type FloatingActionButtonProps = {
    isMenuExpanded: SharedValue<boolean>
    index: number
    icon: string
    label?: string
    onPress: () => void
}

export function FloatingActionButton({
    isMenuExpanded,
    index,
    icon,
    label,
    onPress
}: FloatingActionButtonProps) {
    const menuExpanded = useDerivedValue(() => {
        return isMenuExpanded.value;
    });

    const animatedStyles = useAnimatedStyle(() => {
        const translateY = withSpring(
            isMenuExpanded.value ? (-BUTTON_SIZE - SEPARATOR_SIZES.lightSmall / 2) * index : 0,
            SPRING_CONFIG
        );
        const translateX = withSpring(isMenuExpanded.value ? 0 : BUTTON_SIZE, SPRING_CONFIG);
        const scale = withDelay(index * 100, withTiming(Number(isMenuExpanded.value)));

        return { transform: [{ translateY }, { translateX }, { scale }] };
    });

    const labelStyle = useAnimatedStyle(() => {
        const opacity = withTiming(Number(isMenuExpanded.value), { duration: 500 });

        return { opacity };
    });

    return (
        <AnimatedPressable
            style={ [animatedStyles, styles.container] }
            onPress={ onPress }
            disabled={ !menuExpanded }
            pointerEvents={ "auto" }
            hitSlop={ 10 }
        >
            <View style={ styles.labelContainer }>
                <Animated.Text style={ [styles.labelContainer.text, labelStyle] }>{ label }</Animated.Text>
            </View>
            <View style={ styles.iconContainer }>
                <Icon icon={ icon } size={ FONT_SIZES.h3 } color={ COLORS.white2 }/>
            </View>
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        maxHeight: BUTTON_SIZE,
        backgroundColor: COLORS.gray4,
        borderRadius: 12.5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingRight: BUTTON_SIZE,
        borderColor: COLORS.gray5,
        borderWidth: 1.5
    },
    labelContainer: {
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: SEPARATOR_SIZES.lightSmall,
        paddingVertical: SEPARATOR_SIZES.lightSmall / 2,

        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            color: COLORS.white2
        }
    },
    iconContainer: {
        position: "absolute",
        right: -5,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.gray5,
        borderColor: COLORS.gray4,
        borderWidth: 1.5
    }
});