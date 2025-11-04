import { Color } from "../../types/index.ts";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { useEffect } from "react";
import getContrastingColor from "../../utils/colors/getContrastingColor.ts";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { AnimatedMaterialIcon, AnimatedPressable } from "../AnimatedComponents/index.ts";
import { StyleSheet } from "react-native";

export type FilterButtonProps = {
    title: string
    active: boolean
    activeColor?: Color
    icon?: string
    iconOnPress?: () => void
    onPress: () => void
}

export function FilterButton({
    title,
    active,
    activeColor = COLORS.white,
    icon,
    iconOnPress,
    onPress
}: FilterButtonProps) {
    const isActive = useSharedValue(Number(active));
    const activeTextColor = getContrastingColor(activeColor, COLORS.white, COLORS.black2);

    const textColor = useDerivedValue(() => interpolateColor(
        isActive.value,
        [0, 1],
        [COLORS.white, activeTextColor]
    ));

    useEffect(() => {
        isActive.value = withTiming(Number(active), 350);
    }, [active]);

    const containerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            isActive.value,
            [0, 1],
            [COLORS.gray4, activeColor]
        );

        return { backgroundColor };
    });

    const textStyle = useAnimatedStyle(() => ({ color: textColor.value }));
    const borderStyle = useAnimatedStyle(() => ({ borderColor: textColor.value }));
    const iconStyle = useAnimatedStyle(() => ({ color: textColor.value }));

    return (
        <AnimatedPressable
            onPress={ onPress }
            style={ [styles.container, containerStyle] }
        >
            <Animated.Text style={ [styles.titleText, textStyle] }>
                { title }
            </Animated.Text>
            {
                icon &&
               <Animated.View style={ [styles.iconContainer, borderStyle] }>
                  <AnimatedMaterialIcon
                     name={ icon }
                     size={ FONT_SIZES.p4 * ICON_FONT_SIZE_SCALE }
                     style={ iconStyle }
                     onPress={ iconOnPress }
                     disabled={ !iconOnPress }
                  />
               </Animated.View>
            }
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12.5
    },
    titleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p4,
        letterSpacing: FONT_SIZES.p4 * 0.035,
        padding: SEPARATOR_SIZES.lightSmall
    },
    iconContainer: {
        borderLeftWidth: 1.25,
        paddingHorizontal: SEPARATOR_SIZES.lightSmall / 2
    }
});