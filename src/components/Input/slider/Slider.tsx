import React, { useCallback, useState } from "react";
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Gesture, GestureDetector, GestureUpdateEvent } from "react-native-gesture-handler";
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { Color } from "../../../types/index.ts";
import type {
    PanGestureHandlerEventPayload
} from "react-native-gesture-handler/src/handlers/GestureHandlerEventPayload.ts";
import { PanGestureChangeEventPayload } from "react-native-gesture-handler/src/handlers/gestures/panGesture.ts";

interface SliderProps {
    value?: number;
    setValue?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    measurement?: string;
    style?: Partial<SliderStyle>;
}

type SliderStyle = {
    borderRadius: number
    trackHeight: number
    trackColor: Color
    barColor: Color
    minBarWidth: number
    handleHeight: number
    handleWidth: number
    handleColor: Color
    innerHandleWidth: number
    innerHandleHeight: number
    innerHandleColor: Color
    tooltipColor: Color
    valueTextColor: Color
    boundingValuesTextColor: Color
    showsBoundingValues: boolean
    showsTooltip: boolean
    showsHandle: boolean
    innerTooltip: boolean
}

const Slider: React.FC<SliderProps> = ({
    minValue = 0,
    maxValue,
    value = minValue,
    setValue,
    measurement,
    style = {}
}) => {
    const {
        borderRadius = 25,
        trackHeight = hp(1),
        trackColor = COLORS.gray3,
        barColor = COLORS.gray1,
        handleHeight = hp(3.5),
        handleWidth = hp(3.5),
        handleColor = barColor,
        innerHandleHeight = handleHeight * 0.875,
        innerHandleWidth = handleWidth * 0.875,
        innerHandleColor = trackColor,
        tooltipColor = trackColor,
        valueTextColor = COLORS.white,
        boundingValuesTextColor = COLORS.gray1,
        showsBoundingValues = true,
        showsTooltip = true,
        showsHandle = true,
        innerTooltip
    } = style;
    const minBarWidth = SEPARATOR_SIZES.lightSmall; // csak akkora ha nincs handle
    const tooltipBottomTriangleHeight = 16;
    const [tooltipLayout, setTooltipLayout] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    const styles = useStyles({
        borderRadius,
        trackHeight,
        trackColor,
        barColor,
        minBarWidth,
        handleHeight,
        handleWidth,
        handleColor,
        innerHandleHeight,
        innerHandleWidth,
        innerHandleColor,
        tooltipColor,
        tooltipLayout,
        tooltipBottomTriangleHeight,
        valueTextColor,
        boundingValuesTextColor,
        showsHandle
    });

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const trackWidth = useSharedValue(0);
    const thumbOffset = useSharedValue(0);
    const percent = useSharedValue(0);
    const inputValue = useSharedValue(value);
    const [tooltipText, setTooltipText] = useState(`${ inputValue }`);

    useAnimatedReaction(
        () => inputValue.value,
        (newVal) => {
            let text = newVal.toString();
            if(measurement) text += ` ${ measurement }`;
            runOnJS(setTooltipText)(text);
        }
    );

    const calculateValue = useCallback((offset: number) => {
        "worklet";
        const newPercent = Math.max(0, Math.min(100, (offset / (trackWidth.value - handleWidth)) * 100));
        percent.value = newPercent;

        const value = Math.round(minValue + ((maxValue - minValue) * (newPercent / 100)));
        inputValue.value = value;

        return value;
    }, [trackWidth]);

    const updateInputFieldValue = useCallback((value: number) => {
        "worklet";
        if(setValue) runOnJS(setValue)(value);
        if(onChange) runOnJS(onChange)(value);
    }, []);

    const panOnChange = (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
        "worklet";
        thumbOffset.value = Math.min(trackWidth.value - handleWidth, Math.max(0, thumbOffset.value + event.changeX));

        calculateValue(thumbOffset.value);
    };

    const panOnEnd = () => {
        "worklet";
        updateInputFieldValue(inputValue.value);
    };

    const barPan = Gesture.Pan().enabled(!showsHandle).onChange(panOnChange).onEnd(panOnEnd);
    const handlePan = Gesture.Pan().enabled(showsHandle).onChange(panOnChange).onEnd(panOnEnd);

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width);
    };

    const onTooltipTextLayout = (event: LayoutChangeEvent) => {
        const width = event.nativeEvent.layout.width + 2 * SEPARATOR_SIZES.lightSmall;
        const height = event.nativeEvent.layout.height + 2 * SEPARATOR_SIZES.lightSmall + (innerTooltip
                                                                                           ? 0
                                                                                           : tooltipBottomTriangleHeight);

        setTooltipLayout({ width, height });
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        let offset = Math.min(
            trackWidth.value - handleWidth,
            Math.max(0, event.nativeEvent.locationX - (showsHandle ? handleWidth / 2 : 0))
        );
        thumbOffset.value = offset;

        updateInputFieldValue(calculateValue(offset));
    };

    const sliderBarStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(
                percent.value,
                [0, 100],
                [0, trackWidth.value]
            )
        };
    });

    const sliderHandleStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(
                        percent.value,
                        [0, 100],
                        [0, trackWidth.value - handleWidth]
                    )
                }
            ]
        };
    });

    const tooltipContainerStyle = useAnimatedStyle(() => {
        if(!showsTooltip) return {};

        const handleBound = showsHandle ? handleWidth / 2 : 0;
        const handleX = interpolate(
            percent.value,
            [0, 100],
            [handleBound, trackWidth.value - handleBound]
        );

        const toolbarX = handleX - (!innerTooltip ? tooltipLayout.width / 2 : 0);
        let left = toolbarX;
        const borderRadius = 7.5;
        let borderTopRightRadius = borderRadius;
        let borderBottomRightRadius = borderRadius;
        let borderTopLeftRadius = borderRadius;
        let borderBottomLeftRadius = borderRadius;

        if(!innerTooltip) {
            if(toolbarX + tooltipLayout.width / 2 >= trackWidth.value - tooltipLayout.width) {
                left -= tooltipLayout.width / 2 - tooltipBottomTriangleHeight / 2;
            } else if(toolbarX - tooltipLayout.width / 2 <= 0) {
                left += tooltipLayout.width / 2 - tooltipBottomTriangleHeight / 2;
            }
        } else {
            if(toolbarX - tooltipLayout.width * 1.25 > 0) {
                left -= tooltipLayout.width;
                borderTopRightRadius = 0;
                borderBottomRightRadius = 0;
            } else {
                borderTopLeftRadius = 0;
                borderBottomLeftRadius = 0;
            }
        }

        let translateY = -tooltipLayout.height;
        if(innerTooltip) translateY = trackHeight / 2 - tooltipLayout.height / 2;

        let minLeft = innerTooltip ? minBarWidth : 0;
        return {
            left: Math.min(Math.max(minLeft, left), trackWidth.value - tooltipLayout.width),
            transform: [
                { translateY }
            ],
            borderTopRightRadius,
            borderBottomRightRadius,
            borderTopLeftRadius,
            borderBottomLeftRadius,
            zIndex: 100
        };
    });

    const tooltipBottomTriangleStyle = useAnimatedStyle(() => {
        if(!showsTooltip || innerTooltip) return {};

        const handleBound = showsHandle ? handleWidth / 2 : 0;
        const handleX = interpolate(
            percent.value,
            [0, 100],
            [handleBound, trackWidth.value - handleBound]
        );

        const toolbarX = handleX - tooltipLayout.width / 2;
        let left = undefined;
        if(toolbarX + tooltipLayout.width / 2 >= trackWidth.value - tooltipLayout.width) {
            left = tooltipLayout.width + tooltipLayout.width / 6;
        } else if(toolbarX - tooltipLayout.width / 2 <= 0) {
            left = 0;
        }

        return {
            left: Math.max(
                0,
                Math.min(left, tooltipLayout.width - tooltipBottomTriangleHeight)
            ),
            transform: [
                { rotateX: "180deg" },
                { translateY: -tooltipLayout.height + 2 * SEPARATOR_SIZES.lightSmall + tooltipBottomTriangleHeight }
            ]
        };
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.slider }>
                <View style={ styles.tag }/>
                <View style={ [styles.tag, { left: "50%" }] }/>
                <View style={ [styles.tag, { left: "75%" }] }/>
                <Pressable
                    style={ styles.slider.track }
                    onLayout={ onTrackLayout }
                    onPress={ onTrackPress }
                >
                    <GestureDetector gesture={ barPan }>
                        <Animated.View style={ [styles.slider.bar, sliderBarStyle] }/>
                    </GestureDetector>
                    {
                        showsTooltip &&
                       <TouchableWithoutFeedback>
                          <View style={ { position: "absolute", top: 0 } }>
                             <Animated.View style={ [styles.slider.tooltip, tooltipContainerStyle] }>
                                 {
                                     !innerTooltip &&
                                    <Animated.View
                                       style={ [styles.slider.tooltip.bottomTriangle, tooltipBottomTriangleStyle] }/>
                                 }
                                <Text
                                   onLayout={ onTooltipTextLayout }
                                   style={ styles.slider.tooltip.text }
                                >
                                    { tooltipText }
                                </Text>
                             </Animated.View>
                          </View>
                       </TouchableWithoutFeedback>
                    }
                    {
                        showsHandle &&
                       <GestureDetector gesture={ handlePan }>
                          <TouchableWithoutFeedback>
                             <Animated.View style={ [styles.slider.handle, sliderHandleStyle] }>
                                <View style={ styles.slider.handle.innerHandle }/>
                             </Animated.View>
                          </TouchableWithoutFeedback>
                       </GestureDetector>
                    }
                </Pressable>
            </View>
            {
                !showsBoundingValues &&
               <View style={ styles.boundingValues }>
                  <Text style={ styles.boundingValues.text }>{ minValue } { measurement }</Text>
                  <Text style={ styles.boundingValues.text }>{ maxValue } { measurement }</Text>
               </View>
            }
        </View>
    );
};

type UseStylesArg =
    Omit<SliderStyle, "showsBoundingValues" | "showsTooltip"> &
    {
        tooltipBottomTriangleHeight: number,
        tooltipLayout: { width: number, height: number }
    }

const useStyles = ({
    borderRadius,
    trackHeight,
    trackColor,
    barColor,
    minBarWidth,
    tooltipLayout,
    tooltipBottomTriangleHeight,
    tooltipColor,
    handleHeight,
    handleWidth,
    handleColor,
    innerHandleHeight,
    innerHandleWidth,
    innerHandleColor,
    valueTextColor,
    boundingValuesTextColor,
    showsHandle
}: UseStylesArg) => StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall / 3,
        alignItems: "center",
        marginTop: tooltipLayout.height
    },

    boundingValues: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,
        width: "100%",

        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            color: boundingValuesTextColor
        }
    },

    tag: {
        position: "absolute",
        left: "25%",
        width: 5,
        height: trackHeight,
        backgroundColor: COLORS.black,
        zIndex: 1
    },

    slider: {
        flex: 1,
        width: "100%",
        position: "relative",
        minHeight: handleHeight,
        justifyContent: "center",

        track: {
            position: "relative",
            height: trackHeight,
            justifyContent: "center",
            backgroundColor: trackColor,
            borderRadius: borderRadius
        },

        bar: {
            position: "absolute",
            bottom: 0,
            height: "100%",
            minWidth: !showsHandle ? minBarWidth : 0,
            backgroundColor: barColor,
            borderRadius: borderRadius
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
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            width: tooltipLayout.width,
            backgroundColor: tooltipColor,
            paddingVertical: SEPARATOR_SIZES.lightSmall,
            zIndex: 60,

            bottomTriangle: {
                position: "absolute",
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderBottomWidth: tooltipBottomTriangleHeight,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: tooltipColor
            },

            text: {
                fontFamily: "Gilroy-Medium",
                fontWeight: "bold",
                fontSize: FONT_SIZES.p4,
                color: valueTextColor
            }
        }
    }
});

export default Slider;