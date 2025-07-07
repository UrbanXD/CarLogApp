import React, { useEffect, useMemo, useState } from "react";
import {
    GestureResponderEvent,
    Keyboard,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { Gesture, GestureDetector, GestureUpdateEvent } from "react-native-gesture-handler";
import Animated, {
    dispatchCommand,
    interpolate,
    interpolateColor,
    runOnJS,
    runOnUI,
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedRef,
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

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface SliderProps {
    value?: number;
    setValue?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    measurement?: string;
    disabled?: boolean;
    tapToSeek?: boolean;
    changeValueWithTooltip?: boolean;
    style?: Partial<SliderStyle>;
}

type SliderStyle = {
    borderRadius: number
    trackHeight: number
    trackColor: Color
    trackBorderWidth: number
    barColor: Color | Array<{ color: Color, percent: number }>
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
    showsTag: boolean
    innerTooltip: boolean
}

const Slider: React.FC<SliderProps> = ({
    minValue = 0,
    maxValue,
    value = minValue,
    setValue,
    measurement,
    disabled,
    tapToSeek = true,
    tooltipAsInputField = false,
    style = {} as SliderStyle
}) => {
    const tooltipInputRef = useAnimatedRef();

    const {
        borderRadius = 25,
        trackHeight = hp(1),
        trackColor = COLORS.gray3,
        trackBorderWidth = 0,
        barColor = COLORS.gray1 as SliderStyle["barColor"],
        handleHeight = hp(3.5),
        handleWidth = hp(3.5),
        handleColor = COLORS.gray1,
        innerHandleHeight = handleHeight * 0.875,
        innerHandleWidth = handleWidth * 0.875,
        innerHandleColor = trackColor,
        tooltipColor = trackColor,
        valueTextColor = COLORS.white,
        boundingValuesTextColor = COLORS.gray1,
        showsBoundingValues = true,
        showsTooltip = true,
        showsHandle = true,
        showsTag = false,
        innerTooltip = false
    } = style;
    const minBarWidth = SEPARATOR_SIZES.lightSmall; // csak akkor ha nincs handle
    const tooltipPaddingVertical = SEPARATOR_SIZES.lightSmall / 2;
    const tooltipPaddingHorizontal = SEPARATOR_SIZES.small / 2;
    const tooltipBorderRadius = 7.5;
    const tooltipBottomTriangleHeight = 10;
    const [tooltipLayout, setTooltipLayout] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;
    const error = inputFieldContext?.fieldState?.error;

    const trackWidth = useSharedValue(0);
    const thumbOffset = useSharedValue(0);
    const percent = useSharedValue(0);
    const inputValue = useSharedValue(0);
    const bounds = useSharedValue({ min: minValue, max: maxValue });
    const [trackLayoutReady, setTrackLayoutReady] = useState(false);

    const setInputValue = () => {
        "worklet";
        inputValue.value = Math.floor(bounds.value.min + ((bounds.value.max - bounds.value.min) * (percent.value / 100)));
    };

    const calculatePercentByValue = () => {
        "worklet";
        percent.value = Math.max(
            0,
            Math.min(100, (inputValue.value - bounds.value.min) * 100 / (bounds.value.max - bounds.value.min))
        );
    };

    const calculatePercentByOffset = () => {
        "worklet";
        percent.value = Math.max(
            0,
            Math.min(100, (thumbOffset.value / (trackWidth.value - (showsHandle ? handleWidth : 0))) * 100)
        );
    };

    const calculateOffsetByPercent = () => {
        "worklet";
        calculatePercentByValue();

        thumbOffset.value = percent.value * (trackWidth.value - (showsHandle ? handleWidth : 0)) / 100;

        setInputValue();
    };

    const calculateOffsetByTapPosition = (locationX: number) => {
        "worklet";
        thumbOffset.value = Math.min(
            trackWidth.value - (showsHandle ? handleWidth : 0),
            Math.max(0, locationX - (showsHandle ? handleWidth / 2 : 0))
        );

        calculatePercentByOffset();

        setInputValue();
    };

    const calculateOffsetByPanning = (changeX: number) => {
        "worklet";
        thumbOffset.value = Math.min(
            trackWidth.value - (showsHandle ? handleHeight : 0),
            Math.max(0, thumbOffset.value + changeX)
        );
    };

    useEffect(() => {
        if(!trackLayoutReady) return;

        inputValue.value = inputFieldContext?.field.value || value;
        runOnUI(calculateOffsetByPercent)();
    }, [trackLayoutReady, inputFieldContext?.field.value, value]);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            runOnUI(dispatchCommand)(tooltipInputRef, "blur");
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if(bounds.value.min === minValue && bounds.value.max === maxValue) return;

        bounds.value = { min: minValue, max: maxValue };
    }, [maxValue, minValue]);

    useAnimatedReaction(
        () => bounds.value,
        (newBounds, prevBounds) => {
            if(newBounds.min === prevBounds?.min && newBounds.max === prevBounds?.max) return;

            calculateOffsetByPercent();
        }
    );

    useAnimatedReaction(
        () => trackWidth.value,
        (newWidth) => runOnJS(setTrackLayoutReady)(newWidth > 0)
    );

    const onTrackPress = (event: GestureResponderEvent) => {
        runOnUI(calculateOffsetByTapPosition)(event.nativeEvent.locationX);
    };

    const panOnChange = (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
        "worklet";
        calculateOffsetByPanning(event.changeX);
        calculatePercentByOffset();
        setInputValue();
    };

    const panOnEnd = () => {
        "worklet";
        if(setValue) runOnJS(setValue)(value);
        if(onChange) runOnJS(onChange)(value);
    };

    const barPan = useMemo(
        () => Gesture.Pan()
        .enabled(!showsHandle && !disabled)
        .onChange(panOnChange)
        .onEnd(panOnEnd),
        [showsHandle]
    );

    const handlePan = useMemo(
        () => Gesture.Pan()
        .enabled(showsHandle && !disabled)
        .onChange(panOnChange)
        .onEnd(panOnEnd),
        [showsHandle]
    );

    const tooltipPan = useMemo(
        () => Gesture.Pan()
        .enabled(showsTooltip && !disabled)
        .onChange(panOnChange)
        .onEnd(panOnEnd)
    );

    const tooltipDoubleTap = useMemo(
        () => Gesture.Tap()
        .enabled(showsTooltip && !disabled && tooltipAsInputField)
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
            dispatchCommand(tooltipInputRef, "focus");
        })
    );

    const tooltipGesture = Gesture.Exclusive(tooltipDoubleTap, tooltipPan);

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.value = (event.nativeEvent.layout.width - 2 * trackBorderWidth);
    };

    const onTooltipTextLayout = (event: LayoutChangeEvent) => {
        if(!showsTooltip) setTooltipLayout({ width: 0, height: 0 });

        const width = event.nativeEvent.layout.width + 2 * tooltipPaddingHorizontal;
        const height =
            event.nativeEvent.layout.height +
            2 * tooltipPaddingVertical +
            (innerTooltip ? 0 : tooltipBottomTriangleHeight);

        if(tooltipLayout.width === width && tooltipLayout.height === height) return;
        setTooltipLayout({ width, height });
    };

    const sliderBarStyle = useAnimatedStyle(() => {
        const width = interpolate(
            percent.value,
            [0, 100],
            [0, trackWidth.value]
        );

        let backgroundColor;
        if(Array.isArray(barColor)) {
            const inputRange: Array<number> = [];
            const outputRange: Array<Color> = [];

            barColor.map(element => {
                inputRange.push(element.percent);
                outputRange.push(element.color);
            });

            backgroundColor = interpolateColor(percent.value, inputRange, outputRange);
        } else {
            backgroundColor = barColor;
        }

        return { width, backgroundColor };
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
        let left = toolbarX + trackBorderWidth;
        let borderTopRightRadius = tooltipBorderRadius;
        let borderBottomRightRadius = tooltipBorderRadius;
        let borderTopLeftRadius = tooltipBorderRadius;
        let borderBottomLeftRadius = tooltipBorderRadius;

        if(!innerTooltip) {
            if(toolbarX + tooltipLayout.width / 2 >= trackWidth.value - tooltipLayout.width) {
                left -= tooltipLayout.width / 2 - tooltipBottomTriangleHeight / 2;
                borderBottomRightRadius = 0;
            } else if(toolbarX - tooltipLayout.width / 2 <= 0) {
                left += tooltipLayout.width / 2 - tooltipBottomTriangleHeight / 2;
                borderBottomLeftRadius = 0;
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

        let translateY = -tooltipLayout.height * 0.95;
        if(innerTooltip) translateY = 0;

        let minLeft = innerTooltip ? minBarWidth : 0;

        return {
            minWidth: tooltipLayout.width,
            left: Math.min(Math.max(minLeft, left), trackWidth.value - tooltipLayout.width),
            transform: [{ translateY }],
            borderTopRightRadius,
            borderBottomRightRadius,
            borderTopLeftRadius,
            borderBottomLeftRadius
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
            left = tooltipLayout.width;
        } else if(toolbarX - tooltipLayout.width / 2 <= 0) {
            left = -1;
        }

        left = Math.max(
            -1,
            Math.min(left, tooltipLayout.width - tooltipBottomTriangleHeight)
        );

        const translateY = -tooltipLayout.height / 2 + 1;

        return {
            left,
            transform: [
                { rotateX: "180deg" },
                { translateY }
            ]
        };
    });

    const styles = useMemo(() => useStyles({
        borderRadius,
        trackHeight,
        trackColor,
        trackBorderWidth,
        minBarWidth,
        handleHeight,
        handleWidth,
        handleColor,
        innerHandleHeight,
        innerHandleWidth,
        innerHandleColor,
        tooltipColor,
        tooltipLayout,
        tooltipPaddingVertical,
        tooltipBottomTriangleHeight,
        valueTextColor,
        boundingValuesTextColor,
        showsHandle,
        showsTooltip,
        innerTooltip
    }), [trackColor, showsHandle, tooltipLayout, handleHeight]);

    const animatedTooltipProps = useAnimatedProps(() => {
        let text = inputValue.value.toString();
        if(measurement) text += ` ${ measurement }`;
        if(setValue) runOnJS(setValue)(inputValue.value);

        return {
            text: text,
            defaultValue: text
        };
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.slider }>
                {
                    showsTooltip &&
                   <GestureDetector gesture={ tooltipGesture }>
                      <Animated.View
                         style={ [styles.slider.tooltip, tooltipContainerStyle] }
                      >
                          {
                              !innerTooltip &&
                             <Animated.View
                                style={ [styles.slider.tooltip.bottomTriangle, tooltipBottomTriangleStyle] }
                             />
                          }
                         <View pointerEvents="none">
                            <AnimatedTextInput
                               ref={ tooltipInputRef }
                               editable={ tooltipAsInputField }
                               animatedProps={ animatedTooltipProps }
                               keyboardType="numeric"
                               style={ styles.slider.tooltip.text }
                               onLayout={ onTooltipTextLayout }
                            />
                         </View>
                      </Animated.View>
                   </GestureDetector>
                }
                <Pressable
                    style={ [styles.slider.track, error && styles.slider.track.error] }
                    onLayout={ onTrackLayout }
                    onPress={ onTrackPress }
                    disabled={ (disabled || !tapToSeek) }
                >
                    {
                        showsTag &&
                       <>
                          <View style={ styles.tag } pointerEvents="none"/>
                          <View style={ [styles.tag, { left: "50%" }] } pointerEvents="none"/>
                          <View style={ [styles.tag, { left: "75%" }] } pointerEvents="none"/>
                       </>
                    }
                    <GestureDetector gesture={ barPan }>
                        <Animated.View style={ [styles.slider.bar, sliderBarStyle] }/>
                    </GestureDetector>
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
                showsBoundingValues &&
               <View style={ styles.boundingValues }>
                  <Text style={ styles.boundingValues.text }>{ minValue } { measurement }</Text>
                  <Text style={ styles.boundingValues.text }>{ maxValue } { measurement }</Text>
               </View>
            }
        </View>
    );
};

type UseStylesArg =
    Omit<SliderStyle, "showsBoundingValues" | "barColor"> &
    {
        tooltipBottomTriangleHeight: number,
        tooltipPaddingVertical: number,
        tooltipLayout: { width: number, height: number }
    }

const useStyles = ({
    borderRadius,
    trackHeight,
    trackColor,
    trackBorderWidth,
    minBarWidth,
    tooltipLayout,
    tooltipPaddingVertical,
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
    showsHandle,
    showsTooltip,
    innerTooltip
}: UseStylesArg) => StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: showsTooltip && !innerTooltip ? tooltipLayout.height : 0
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
            borderRadius: borderRadius,
            borderColor: COLORS.gray1,
            borderWidth: trackBorderWidth,

            error: {
                borderColor: COLORS.redLight
            }
        },

        bar: {
            position: "absolute",
            bottom: 0,
            height: "100%",
            minWidth: !showsHandle ? minBarWidth : 0,
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
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tooltipColor,
            paddingVertical: tooltipPaddingVertical,

            bottomTriangle: {
                position: "absolute",
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: tooltipBottomTriangleHeight / 2,
                borderRightWidth: tooltipBottomTriangleHeight / 2,
                borderBottomWidth: tooltipBottomTriangleHeight,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: tooltipColor
            },

            text: {
                fontFamily: "Gilroy-Medium",
                fontWeight: "bold",
                fontSize: FONT_SIZES.p4,
                color: valueTextColor,
                textAlign: "center"
            }
        }
    }
});

export default React.memo(Slider);