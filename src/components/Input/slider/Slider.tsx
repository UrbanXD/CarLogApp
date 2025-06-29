import React, { useEffect, useState } from "react";
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
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { Color } from "../../../types/index.ts";

interface SliderProps {
    value?: number;
    setValue?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    style?: Partial<SliderStyle>;
}

type SliderStyle = {
    trackHeight: number
    trackColor: Color
    barColor: Color
    handleHeight: number
    handleWidth: number
    handleColor: Color
    innerHandleWidth: number
    innerHandleHeight: number
    innerHandleColor: Color
    tooltipColor: Color
    valuesTextColor: Color
    showsBoundingValues?: boolean
}

const Slider: React.FC<SliderProps> = ({
    minValue = 0,
    maxValue,
    value = minValue,
    setValue,
    style = {}
}) => {
    const {
        trackHeight = hp(1),
        trackColor = COLORS.gray3,
        barColor = COLORS.gray1,
        handleHeight = hp(3.5),
        handleWidth = hp(3.5),
        handleColor = trackColor,
        innerHandleHeight = handleHeight / 1.35,
        innerHandleWidth = handleWidth / 1.35,
        innerHandleColor = barColor,
        tooltipColor = handleColor,
        valuesTextColor = COLORS.white,
        showsBoundingValues = true
    } = style;
    const toolbarTriangleHeight = 16;

    const styles = useStyles({
        trackHeight,
        trackColor,
        barColor,
        handleHeight,
        handleWidth,
        handleColor,
        innerHandleHeight,
        innerHandleWidth,
        innerHandleColor,
        tooltipColor,
        valuesTextColor
    });

    const [panning, setPanning] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const trackWidth = useSharedValue(Dimensions.get("window").width);
    const thumbOffset = useSharedValue(0);
    const percent = useSharedValue(0);
    const tooltipLayout = useSharedValue<{ width: number, height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        if(panning) return;

        if(setValue) setValue(inputValue);
        if(onChange) onChange(inputValue);
    }, [inputValue, panning]);

    const calculateValue = (offset: number) => {
        const percentValue = Math.round(
            Math.max(
                0,
                Math.min(100, (offset / (trackWidth.value - handleWidth)) * 100)
            )
        );
        percent.value = percentValue;

        let updatedValue = percentValue;
        if(maxValue) updatedValue = Math.round(minValue + (maxValue - minValue) * (percentValue / 100));

        setInputValue(updatedValue);
    };

    const pan = Gesture.Pan()
    .onStart(_event => {
        runOnJS(setPanning)(true);
    })
    .onChange((event) => {
        thumbOffset.value = Math.min(
            trackWidth.value - handleWidth,
            Math.max(0, thumbOffset.value + event.changeX)
        );
        runOnJS(calculateValue)(thumbOffset.value);
    })
    .onEnd(_event => {
        runOnJS(setPanning)(false);
    });

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width + innerHandleWidth);
    };

    const onTooltipTextLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width + 2 * SEPARATOR_SIZES.lightSmall;
        const height = event.nativeEvent.layout.height;
        tooltipLayout.set({ width, height });
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        let offset = Math.min(
            trackWidth.value - handleWidth,
            Math.max(0, event.nativeEvent.locationX)
        );
        thumbOffset.value = offset;

        calculateValue(offset);
    };

    const sliderBarStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(percent.value, [0, 100], [0, trackWidth.value - handleWidth]) // a handle width-je kivonasra kerul, hogy ne loghasson tul
        };
    });

    const tooltipContainerStyle = useAnimatedStyle(() => {
        const handleX = interpolate(
            percent.value,
            [0, 100],
            [0, trackWidth.value - 1.75 * handleWidth]
        );

        return {
            left: handleX + (handleWidth / 2) - (tooltipLayout.value.width / 2),
            width: tooltipLayout.value.width,
            transform: [
                { translateY: trackHeight - tooltipLayout.value.height * 2 - toolbarTriangleHeight - handleHeight / 2 }
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
                        [0, trackWidth.value - 1.75 * handleWidth]
                    )
                }
            ]
        };
    });

    return (
        <View style={ styles.container }>
            { showsBoundingValues && <Text style={ styles.steps.text }>{ minValue }</Text> }
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
            { showsBoundingValues && <Text style={ styles.steps.text }>{ maxValue }</Text> }
        </View>
    );
};

const useStyles = ({
    trackHeight,
    trackColor,
    barColor,
    tooltipColor,
    handleHeight,
    handleWidth,
    handleColor,
    innerHandleHeight,
    innerHandleWidth,
    innerHandleColor,
    valuesTextColor
}: SliderStyle) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center"
    },
    slider: {
        flex: 1,
        position: "relative",
        minHeight: handleHeight,
        justifyContent: "center",

        track: {
            position: "relative",
            height: trackHeight,
            justifyContent: "center",
            backgroundColor: trackColor,
            borderRadius: 25
        },

        bar: {
            position: "absolute",
            bottom: 0,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: 25
        },

        handle: {
            position: "absolute",
            width: handleWidth,
            height: handleHeight,
            backgroundColor: handleColor,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
            zIndex: 5,

            innerHandle: {
                width: innerHandleWidth,
                height: innerHandleHeight,
                backgroundColor: innerHandleColor,
                borderRadius: 50
            }
        },

        tooltip: {
            // position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tooltipColor,
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
                borderBottomColor: tooltipColor
            },

            text: {
                fontFamily: "Gilroy-Medium",
                fontWeight: "bold",
                fontSize: FONT_SIZES.p4,
                color: valuesTextColor
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
            color: valuesTextColor
        }
    }
});

export default Slider;