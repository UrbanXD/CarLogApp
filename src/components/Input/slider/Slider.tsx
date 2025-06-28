import React, { useState } from "react";
import {
    Dimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";

interface SliderProps {
    value?: number;
    setValue?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
}

const Slider: React.FC<SliderProps> = ({
    minValue = 0,
    maxValue,
    value = minValue,
    setValue
}) => {
    const [inputValue, setInputValue] = useState(value);
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const trackWidth = useSharedValue(Dimensions.get("window").width);
    const thumbOffset = useSharedValue(0);
    const percent = useSharedValue(0);
    const tooltipLayout = useSharedValue<{ width: number, height: number }>({ width: 0, height: 0 });

    const calculatePercent = (offset: number) => {
        const percentValue = Math.round(
            Math.max(
                0,
                Math.min(100, (offset / (trackWidth.value - SLIDER_HANDLE_WIDTH)) * 100)
            )
        );
        percent.value = percentValue;

        let updatedValue = percentValue;
        if(maxValue) updatedValue = Math.round(minValue + (maxValue - minValue) * (percentValue / 100));

        setInputValue(updatedValue);
    };

    const updateValue = (newValue: number) => {
        if(setValue) setValue(newValue);
        if(onChange) onChange(newValue);
    };

    const pan = Gesture.Pan()
    .onChange((event) => {
        thumbOffset.value = Math.min(
            trackWidth.value - SLIDER_HANDLE_WIDTH,
            Math.max(0, thumbOffset.value + event.changeX)
        );
        runOnJS(calculatePercent)(thumbOffset.value);
    })
    .onEnd(_event => {
        runOnJS(updateValue)(1);
    });

    const sliderBarStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(percent.value, [0, 100], [0, trackWidth.value - SLIDER_HANDLE_WIDTH]) // a handle width-je kivonasra kerul, hogy ne loghasson tul
        };
    });

    const tooltipContainerStyle = useAnimatedStyle(() => {
        const handleX = interpolate(
            percent.value,
            [0, 100],
            [0, trackWidth.value - 1.75 * SLIDER_HANDLE_WIDTH]
        );

        return {
            left: handleX + (SLIDER_HANDLE_WIDTH / 2) - (tooltipLayout.value.width / 2),
            width: tooltipLayout.value.width,
            transform: [
                { translateY: -tooltipLayout.value.height - SLIDER_HANDLE_HEIGHT - SEPARATOR_SIZES.lightSmall * 1.25 }
            ]
        };
    });

    const tooltipContainerTriangleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateX: "180deg" },
                { translateY: -tooltipLayout.value.height }
            ]
        };
    });

    const sliderHandleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        percent.value,
                        [0, 100],
                        [0, trackWidth.value - 1.75 * SLIDER_HANDLE_WIDTH]
                    )
                }
            ]
        };
    });

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width + SLIDER_INNER_HANDLE_WIDTH);
    };

    const onTooltipTextLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width + 2 * SEPARATOR_SIZES.lightSmall;
        const height = event.nativeEvent.layout.height;
        tooltipLayout.set({ width, height });
    };


    const onTrackPress = (event: GestureResponderEvent) => {
        let offset = Math.min(
            trackWidth.value - SLIDER_HANDLE_WIDTH,
            Math.max(0, event.nativeEvent.locationX)
        );
        thumbOffset.value = offset;

        calculatePercent(offset);
        updateValue(3);
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.steps.text }>{ minValue }</Text>
            <View style={ styles.slider }>
                <Pressable
                    style={ styles.slider.track }
                    onLayout={ onTrackLayout }
                    onPress={ onTrackPress }
                >
                    <Animated.View style={ [styles.slider.bar, sliderBarStyle] }/>
                    <TouchableWithoutFeedback>
                        <View style={ { position: "absolute", top: 0 } }>
                            <Animated.View style={ [styles.slider.tooltip, tooltipContainerStyle] }>
                                <Animated.View
                                    style={ [styles.slider.tooltip.bottomTriangle, tooltipContainerTriangleStyle] }
                                />
                                <Text
                                    onLayout={ onTooltipTextLayout }
                                    style={ styles.slider.tooltip.text }
                                >
                                    { inputValue }
                                </Text>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                    <GestureDetector gesture={ pan }>
                        <TouchableWithoutFeedback>
                            <Animated.View style={ [styles.slider.handle, sliderHandleStyle] }>
                                <View style={ styles.slider.handle.innerHandle }/>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    </GestureDetector>
                </Pressable>
            </View>
            <Text style={ styles.steps.text }>{ maxValue }</Text>
        </View>
    );
};

const SLIDER_TRACK_HEIGHT = heightPercentageToDP(0.75);
const SLIDER_HANDLE_HEIGHT = heightPercentageToDP(3.5);
const SLIDER_HANDLE_WIDTH = heightPercentageToDP(3.5);
const SLIDER_INNER_HANDLE_HEIGHT = SLIDER_HANDLE_HEIGHT / 1.35;
const SLIDER_INNER_HANDLE_WIDTH = SLIDER_HANDLE_WIDTH / 1.35;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center"
    },
    slider: {
        flex: 1,
        position: "relative",
        minHeight: SLIDER_HANDLE_HEIGHT,
        justifyContent: "center",

        track: {
            position: "relative",
            height: SLIDER_TRACK_HEIGHT,
            justifyContent: "center",
            backgroundColor: COLORS.gray3,
            borderRadius: 25
        },

        bar: {
            position: "absolute",
            bottom: 0,
            height: "100%",
            backgroundColor: COLORS.gray1,
            borderRadius: 25
        },

        handle: {
            position: "absolute",
            width: SLIDER_HANDLE_WIDTH,
            height: SLIDER_HANDLE_HEIGHT,
            backgroundColor: COLORS.gray3,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            zIndex: 5,

            innerHandle: {
                width: SLIDER_INNER_HANDLE_WIDTH,
                height: SLIDER_INNER_HANDLE_HEIGHT,
                backgroundColor: COLORS.gray1,
                borderRadius: 50
            }
        },

        tooltip: {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.gray3,
            paddingVertical: SEPARATOR_SIZES.lightSmall,
            borderRadius: 7.5,

            bottomTriangle: {
                position: "absolute",
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: 16,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: COLORS.gray3
            },

            text: {
                fontFamily: "Gilroy-Medium",
                fontWeight: "bold",
                fontSize: FONT_SIZES.p4,
                color: COLORS.white
            }
        }
    },
    steps: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",

        text: {
            fontFamily: "Gilroy-Medium",
            fontWeight: "bold",
            fontSize: FONT_SIZES.p4,
            color: COLORS.white
        }
    }
});

export default Slider;