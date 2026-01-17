import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import React, { useCallback, useEffect } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";
import { scheduleOnRN } from "react-native-worklets";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Color, TextStyle, ViewStyle } from "../../../types/index.ts";

type SwitchColorSchema = {
    on: Color;
    off: Color;
};

export type SwitchProps = {
    value?: boolean
    setValue?: (value: boolean) => void
    disabled?: boolean
    duration?: number
    label?: {
        on: string,
        off: string
    }
    thumbColor?: Color | SwitchColorSchema
    trackColor?: Color | SwitchColorSchema,
    trackStyle?: ViewStyle,
    thumbStyle?: ViewStyle,
    labelStyle?: TextStyle
}

const isSwitchColor = (value: Color | SwitchColorSchema): value is SwitchColorSchema => {
    return typeof value === "object" && value !== null && ("on" in value) && ("off" in value);
};

export function Switch({
    value,
    setValue,
    disabled,
    duration = 400,
    label,
    thumbColor = { on: formTheme.containerBackgroundColor, off: formTheme.barColor },
    trackColor = { on: formTheme.barColor, off: formTheme.containerBackgroundColor },
    trackStyle,
    thumbStyle,
    labelStyle
}: SwitchProps) {
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;

    const status = useSharedValue<boolean>(false);
    const layout = useSharedValue({ width: 0, height: 0 });
    const width = useSharedValue<number | undefined>(undefined);

    const trackColorRange = isSwitchColor(trackColor)
                            ? [trackColor.off as string, trackColor.on as string]
                            : [trackColor as string, trackColor as string];

    const thumbColorRange = isSwitchColor(thumbColor)
                            ? [thumbColor.off as string, thumbColor.on as string]
                            : [thumbColor as string, thumbColor as string];

    useEffect(() => {
        status.value = !!value;
    }, [value]);

    useEffect(() => {
        status.value = !!inputFieldContext?.field?.value;
    }, [inputFieldContext?.field?.value]);

    const onUpdate = (status: boolean) => {
        if(onChange && inputFieldContext?.field?.value !== status) onChange(status);
        if(setValue && value !== status) setValue(status);
    };

    useAnimatedReaction(
        () => status.value,
        (status) => {
            scheduleOnRN(onUpdate, status);
        }
    );

    const onPress = useCallback(() => {
        status.value = !status.value;
    }, []);

    const onTrackLayout = (event: LayoutChangeEvent) => {
        layout.value = { width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height };
    };

    const onMeasure = (event: LayoutChangeEvent) => {
        width.value = event.nativeEvent.layout.width;
    };

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            Number(status.value),
            [0, 1],
            trackColorRange
        );
        const colorValue = withTiming(color, { duration });

        return {
            backgroundColor: colorValue,
            width: width.value
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            Number(status.value),
            [0, 1],
            thumbColorRange
        );
        const colorValue = withTiming(color, { duration });

        const moveValue = interpolate(
            Number(status.value),
            [0, 1],
            [0, layout.value.width - layout.value.height * 0.85 - formTheme.containerPaddingHorizontal / 2] // trackWidth - thumbHeight - padding / 2
        );
        const translateValue = withTiming(moveValue, { duration });

        return {
            backgroundColor: colorValue,
            transform: [{ translateX: translateValue }],
            borderRadius: layout.value.height / 2
        };
    });

    const labelAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            Number(status.value),
            [0, 1],
            thumbColorRange
        );
        const colorValue = withTiming(color, { duration });

        return ({
            color: colorValue
        });
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(status.value ? 1 : 0, { duration })
        };
    });

    const textOffAnimatedStyle = useAnimatedStyle(() => {
        return {
            right: 0,
            opacity: withTiming(status.value ? 0 : 1, { duration })
        };
    });

    return (
        <Pressable onPress={ onPress }>
            <View style={ { position: "absolute", opacity: 0 } } onLayout={ onMeasure }>
                <View
                    style={ [styles.track, trackStyle] }
                >
                    {
                        label &&
                       <Text style={ [styles.label, labelStyle, { position: "relative" }] }>
                           { label.on.length > label.off.length ? label.on : label.off }
                       </Text>
                    }
                    <View style={ [styles.thumb, thumbStyle] }/>
                </View>
            </View>
            <Animated.View
                onLayout={ onTrackLayout }
                style={ [styles.track, trackStyle, trackAnimatedStyle] }
            >
                {
                    label &&
                   <>
                      <Animated.Text style={ [styles.label, labelStyle, labelAnimatedStyle, textAnimatedStyle] }>
                          { label.on }
                      </Animated.Text>
                      <Animated.Text style={ [styles.label, labelStyle, labelAnimatedStyle, textOffAnimatedStyle] }>
                          { label.off }
                      </Animated.Text>
                   </>
                }
                <Animated.View style={ [styles.thumb, thumbStyle, thumbAnimatedStyle] }/>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        height: formTheme.containerHeight,
        minWidth: widthPercentageToDP(27.5),
        padding: formTheme.containerPaddingHorizontal,
        borderRadius: formTheme.borderRadius,
        borderColor: formTheme.borderColor,
        borderWidth: 1
    },
    thumb: {
        height: "85%",
        aspectRatio: 1,
        alignSelf: "center",
        backgroundColor: formTheme.thumbColor
    },
    label: {
        position: "absolute",
        paddingHorizontal: formTheme.containerPaddingHorizontal,
        alignSelf: "center",
        fontFamily: "Gilroy-Medium",
        fontSize: formTheme.valueTextFontSize / 1.25,
        letterSpacing: formTheme.valueTextFontSize / 1.25 * 0.025
    }
});