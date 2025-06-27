import React, { useState } from "react";
import {
    Dimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
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

    const calculatePercent = () => {
        percent.value = Math.round(Math.max(
            Math.min((thumbOffset.value / (trackWidth.value - SLIDER_HANDLE_WIDTH)) * 100, 100),
            0
        ));

        let updatedValue = percent.value;
        if(maxValue) updatedValue = Math.round(minValue + (maxValue - minValue) * (percent.value / 100));

        setInputValue(updatedValue);
    };

    const updateValue = () => {
        if(setValue) setValue(updatedValue);
        if(onChange) onChange(updatedValue);
    };

    const pan = Gesture.Pan()
    .onChange((event) => {
        thumbOffset.value = Math.min(
            trackWidth.value - SLIDER_HANDLE_WIDTH,
            Math.max(0, thumbOffset.value + event.changeX)
        );
        runOnJS(calculatePercent)();
    })
    .onEnd(_event => {
        runOnJS(updateValue)();
    });

    const sliderBarStyle = useAnimatedStyle(() => {
        return {
            width: `${ percent.value }%`
        };
    });

    const tooltipContainerStyle = useAnimatedStyle(() => {
        return {
            width: tooltipLayout.value.width,
            transform: [
                { translateY: -1 * (SLIDER_HANDLE_HEIGHT / 2 + 2 * tooltipLayout.value.height + SEPARATOR_SIZES.lightSmall) },
                // { translateY: -1 * (tooltipLayout.value.height + 37.5) },
                { translateX: (-SLIDER_HANDLE_WIDTH + tooltipLayout.value.width) / 2 }
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

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width);
    };

    const onTooltipTextLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width + 2 * SEPARATOR_SIZES.lightSmall;
        const height = event.nativeEvent.layout.height;
        tooltipLayout.set({ width, height });
    };


    const onTrackPress = (event: GestureResponderEvent) => {
        thumbOffset.value = Math.max(0, event.nativeEvent.locationX - SLIDER_HANDLE_WIDTH / 2);
        setTimeout(calculatePercent, 100);
        setTimeout(updateValue, 200);
    };

    return (
        <View style={ styles.container }>
            <Text style={ styles.steps.text }>{ minValue }</Text>
            <View style={ styles.slider }>
                <TouchableOpacity
                    style={ styles.slider.track }
                    onLayout={ onTrackLayout }
                    onPress={ onTrackPress }
                >
                    <Animated.View style={ [styles.slider.bar, sliderBarStyle] }>
                        <Animated.View style={ [styles.slider.tooltip, tooltipContainerStyle] }>
                            <Animated.View
                                style={ [styles.slider.tooltip.bottomTriangle, tooltipContainerTriangleStyle] }/>
                            <Text
                                onLayout={ onTooltipTextLayout }
                                style={ styles.slider.tooltip.text }
                            >
                                { inputValue }
                            </Text>
                        </Animated.View>
                        <GestureDetector gesture={ pan }>
                            <Animated.View style={ styles.slider.handle }/>
                        </GestureDetector>
                    </Animated.View>
                </TouchableOpacity>
            </View>
            <Text style={ styles.steps.text }>{ maxValue }</Text>
        </View>
    );
};

const SLIDER_TRACK_HEIGHT = heightPercentageToDP(0.75);
const SLIDER_HANDLE_HEIGHT = heightPercentageToDP(1.5);
const SLIDER_HANDLE_WIDTH = heightPercentageToDP(1.5);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center"
    },
    slider: {
        flex: 1,
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
            position: "relative",
            height: "100%",
            minWidth: SLIDER_HANDLE_WIDTH,
            backgroundColor: COLORS.gray1,
            borderRadius: 25
        },

        handle: {
            width: SLIDER_HANDLE_WIDTH,
            height: SLIDER_HANDLE_HEIGHT,
            backgroundColor: COLORS.gray1,
            alignSelf: "flex-end",
            borderRadius: 50,
            transform: [
                { translateY: (SLIDER_TRACK_HEIGHT - SLIDER_HANDLE_HEIGHT) / 2 }
            ],
            zIndex: 5
        },

        tooltip: {
            position: "absolute",
            alignSelf: "flex-end",
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