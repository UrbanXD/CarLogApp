import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    BlurEvent,
    FocusEvent,
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
    useAnimatedProps,
    useAnimatedReaction,
    useAnimatedRef,
    useAnimatedStyle,
    useSharedValue
} from "react-native-reanimated";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../constants";
import { Color } from "../../../types";
import type {
    PanGestureHandlerEventPayload
} from "react-native-gesture-handler/src/handlers/GestureHandlerEventPayload.ts";
import { PanGestureChangeEventPayload } from "react-native-gesture-handler/src/handlers/gestures/panGesture.ts";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import { KeyboardController } from "react-native-keyboard-controller";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { BottomSheetTextInput, useBottomSheetInternal } from "@gorhom/bottom-sheet";

const AnimatedTextInput = Animated.createAnimatedComponent(BottomSheetTextInput);

interface SliderProps {
    value?: number;
    setValue?: (value: number) => void;
    minValue?: number;
    maxValue?: number;
    unit?: string;
    disabled?: boolean;
    tapToSeek?: boolean;
    tooltipAsInputField?: boolean;
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
    showsPercent: boolean
    showsTooltip: boolean
    showsHandle: boolean
    showsTag: boolean
    innerTooltip: boolean
}

const Slider: React.FC<SliderProps> = ({
    minValue = 0,
    maxValue = Number.MAX_SAFE_INTEGER,
    value = minValue,
    setValue,
    unit,
    disabled,
    tapToSeek = true,
    tooltipAsInputField = false,
    style = {} as SliderStyle
}) => {
    const bottomSheetInternal = useBottomSheetInternal(true);

    const tooltipInputRef = useAnimatedRef<TextInput>();

    const {
        borderRadius = 25,
        trackHeight = hp(1),
        trackColor = formTheme.trackColor,
        trackBorderWidth = 0,
        barColor = formTheme.barColor as SliderStyle["barColor"],
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
        showsPercent = false,
        showsTooltip = true,
        showsHandle = true,
        showsTag = false,
        innerTooltip = false
    } = style;
    const minBarWidth = SEPARATOR_SIZES.lightSmall; // csak akkor ha nincs handle
    const tooltipPaddingVertical = 0;
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
    const inputValue = useSharedValue(value ? value.toString() : minValue.toString());
    const bounds = useSharedValue({ min: minValue, max: maxValue });

    const [trackLayoutReady, setTrackLayoutReady] = useState(false);
    const [currentValue, setCurrentValue] = useState(value ?? 0);

    useEffect(() => {
        const rawValue = inputFieldContext?.field?.value ?? value;
        const numericValue = (rawValue === "" || rawValue == null) ? NaN : Number(rawValue);
        const fieldValue = (isNaN(numericValue)) ? minValue : Math.min(maxValue, Math.max(minValue, numericValue));

        setCurrentValue(fieldValue);
    }, [inputFieldContext?.field?.value, value, minValue, maxValue]);

    useEffect(() => {
        if(!trackLayoutReady) return;

        const fieldValueNumber = Number(inputFieldContext?.field?.value ?? 0);
        if(setValue && currentValue !== fieldValueNumber) setValue(currentValue);
        if(onChange && currentValue !== fieldValueNumber) onChange(currentValue);

        percent.value = Math.max(
            0,
            Math.min(100, (currentValue - bounds.value.min) * 100 / (bounds.value.max - bounds.value.min))
        );
        inputValue.value = currentValue.toString();

        scheduleOnUI(calculateThumbOffsetByPercent);
    }, [currentValue, trackLayoutReady]);

    useEffect(() => {
        const subscription = Keyboard.addListener("keyboardDidHide", () => {
            scheduleOnUI(dispatchCommand, tooltipInputRef, "blur");
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if(bounds.value.min === minValue && bounds.value.max === maxValue) return;

        bounds.value = { min: minValue, max: maxValue };
    }, [maxValue, minValue]);

    const onFocus = useCallback((event: FocusEvent) => {
        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        animatedKeyboardState.set({
            ...keyboardState,
            target: event.nativeEvent.target
        });
    }, [bottomSheetInternal?.animatedKeyboardState]);

    const onBlur = useCallback((event: BlurEvent) => {
        if(!bottomSheetInternal) return; // return if not in a bottom sheet
        const { animatedKeyboardState } = bottomSheetInternal;
        const keyboardState = animatedKeyboardState.get();

        if(keyboardState.target === event.nativeEvent.target) {
            animatedKeyboardState.set({
                ...keyboardState,
                target: undefined
            });
        }
    }, [bottomSheetInternal?.animatedKeyboardState]);

    const setInputValue = () => {
        "worklet";
        inputValue.value = Math.floor(bounds.value.min + ((bounds.value.max - bounds.value.min) * (percent.value / 100)))
        .toString();
    };

    const calculatePercentByValue = () => {
        "worklet";
        percent.value = Math.max(
            0,
            Math.min(100, (Number(inputValue.value) - bounds.value.min) * 100 / (bounds.value.max - bounds.value.min))
        );
    };

    const calculatePercentByOffset = () => {
        "worklet";
        percent.value = Math.max(
            0,
            Math.min(100, (thumbOffset.value / (trackWidth.value - (showsHandle ? handleWidth : 0))) * 100)
        );
    };

    const calculateThumbOffsetByPercent = () => {
        thumbOffset.value = percent.value * (trackWidth.value - (showsHandle ? handleWidth : 0)) / 100;
    };

    const calculateOffsetByPercent = () => {
        "worklet";
        calculatePercentByValue();

        calculateThumbOffsetByPercent();

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

        const value = Number(inputValue.value);
        if(!isNaN(value)) scheduleOnRN(setCurrentValue, value);
    };

    const calculateOffsetByPanning = (changeX: number) => {
        "worklet";
        thumbOffset.value = Math.min(
            trackWidth.value - (showsHandle ? handleHeight : 0),
            Math.max(0, thumbOffset.value + changeX)
        );
    };

    useAnimatedReaction(
        () => bounds.value,
        (newBounds, prevBounds) => {
            if(newBounds.min === prevBounds?.min && newBounds.max === prevBounds?.max) return;

            calculateOffsetByPercent();
        }
    );

    useAnimatedReaction(
        () => trackWidth.value,
        (newWidth) => scheduleOnRN(setTrackLayoutReady, newWidth > 0)
    );

    const onTrackPress = (event: GestureResponderEvent) => {
        scheduleOnUI(calculateOffsetByTapPosition, event.nativeEvent.locationX);
    };

    const panOnStart = () => {
        scheduleOnRN(KeyboardController.dismiss);
    };

    const panOnChange = (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
        "worklet";
        calculateOffsetByPanning(event.changeX);
        calculatePercentByOffset();
        setInputValue();
    };

    const panOnEnd = () => {
        const value = Number(inputValue.value);
        if(!isNaN(value)) scheduleOnRN(setCurrentValue, value);
    };

    const barPan = useMemo(
        () => Gesture.Pan()
        .enabled(!showsHandle && !disabled)
        .onStart(panOnStart)
        .onChange(panOnChange)
        .onEnd(panOnEnd),
        [showsHandle]
    );

    const handlePan = useMemo(
        () => Gesture.Pan()
        .enabled(showsHandle && !disabled)
        .onStart(panOnStart)
        .onChange(panOnChange)
        .onEnd(panOnEnd),
        [showsHandle]
    );

    const tooltipPan = useMemo(
        () => Gesture.Pan()
        .enabled(showsTooltip && !disabled)
        .onStart(panOnStart)
        .onChange(panOnChange)
        .onEnd(panOnEnd)
        , []);

    const tooltipDoubleTap = useMemo(
        () => Gesture.Tap()
        .enabled(showsTooltip && !disabled && tooltipAsInputField)
        .maxDuration(250)
        .numberOfTaps(2)
        .onStart(() => {
            dispatchCommand(tooltipInputRef, "focus");
        })
        , []);

    const tooltipGesture = Gesture.Exclusive(tooltipPan, tooltipDoubleTap);

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

    const onTooltipTextChange = (value: string) => {
        const numericText = value.replace(/[^0-9.,]/g, "").replace(",", ".");

        let number = numericText.length === 0 ? minValue : Number(numericText);

        const clamped = Math.min(maxValue, Math.max(number, minValue));
        inputValue.value = clamped.toString() + " "; // empty string add to prevent not updating text
        scheduleOnRN(setTimeout, () => {
            let clampedText = clamped.toString();
            if(maxValue !== clamped && numericText.endsWith(".")) clampedText += ".";

            inputValue.value = clampedText;
        }, 100);

        if(!isNaN(number)) {
            scheduleOnUI(calculatePercentByValue);
            scheduleOnUI(calculateThumbOffsetByPercent);
            scheduleOnRN(setCurrentValue, clamped);
        }
    };

    const sliderBarStyle = useAnimatedStyle(() => {
        const width = interpolate(
            percent.value,
            [0, 100],
            [0, trackWidth.value]
        );

        let backgroundColor = barColor as string;
        if(Array.isArray(barColor)) {
            const inputRange: Array<number> = [];
            const outputRange: Array<string> = [];

            barColor.map(element => {
                inputRange.push(element.percent);
                outputRange.push(element.color as string);
            });

            backgroundColor = interpolateColor(percent.value, inputRange, outputRange);
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
        let left = -1;
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
        let text = inputValue.value;

        return { text, defaultValue: text };
    });

    const animatedPercentTextProps = useAnimatedProps(() => {
        let text = `${ percent.value.toFixed(2) }%`;

        return { text, defaultValue: text };
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.sliderContainer }>
                {
                    showsTooltip &&
                   <GestureDetector gesture={ tooltipGesture }>
                      <Animated.View
                         style={ [styles.tooltip, tooltipContainerStyle] }
                      >
                          {
                              !innerTooltip &&
                             <Animated.View
                                style={ [styles.tooltipBottomTriangle, tooltipBottomTriangleStyle] }
                             />
                          }
                         <View
                            onLayout={ onTooltipTextLayout }
                            pointerEvents="none"
                            style={ { flexDirection: "row", alignItems: "center" } }
                         >
                            <AnimatedTextInput
                               ref={ tooltipInputRef as any }
                               defaultValue={ currentValue.toString() }
                               editable={ tooltipAsInputField }
                               animatedProps={ animatedTooltipProps }
                               keyboardType="numeric"
                               style={ styles.tooltipText }
                               onChangeText={ onTooltipTextChange }
                               onBlur={ onBlur }
                               onFocus={ onFocus }
                            />
                             { unit && <Text style={ styles.tooltipText }>{ unit }</Text> }
                         </View>
                      </Animated.View>
                   </GestureDetector>
                }
                <Pressable
                    style={ [styles.track, error && styles.trackError] }
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
                        <Animated.View style={ [styles.bar, sliderBarStyle] }/>
                    </GestureDetector>
                    {
                        showsHandle &&
                       <GestureDetector gesture={ handlePan }>
                          <TouchableWithoutFeedback>
                             <Animated.View style={ [styles.handle, sliderHandleStyle] }>
                                <View style={ styles.innerHandle }/>
                             </Animated.View>
                          </TouchableWithoutFeedback>
                       </GestureDetector>
                    }
                </Pressable>
            </View>
            {
                (showsBoundingValues || showsPercent) &&
               <View style={ styles.boundingValuesContainer }>
                   {
                       showsBoundingValues &&
                      <Text style={ styles.boundingValueText }>{ minValue } { unit }</Text>
                   }
                   {
                       showsPercent &&
                      <AnimatedTextInput
                         defaultValue={ "0%" }
                         editable={ false }
                         animatedProps={ animatedPercentTextProps }
                         style={ [styles.boundingValuesContainer, { padding: 0 }] }
                      />
                   }
                   {
                       showsBoundingValues &&
                      <Text style={ styles.boundingValueText }>{ maxValue } { unit }</Text>
                   }
               </View>
            }
        </View>
    );
};

type UseStylesArg =
    Partial<Omit<SliderStyle, "showsBoundingValues" | "barColor">> &
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
    boundingValuesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,
        width: "100%"
    },
    boundingValueText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: boundingValuesTextColor,
        textAlign: "center"
    },
    tag: {
        position: "absolute",
        left: "25%",
        width: 5,
        height: trackHeight,
        backgroundColor: COLORS.black,
        zIndex: 1
    },
    sliderContainer: {
        flex: 1,
        width: "100%",
        position: "relative",
        minHeight: handleHeight,
        justifyContent: "center"
    },
    track: {
        position: "relative",
        height: trackHeight,
        justifyContent: "center",
        backgroundColor: trackColor,
        borderRadius: borderRadius,
        borderColor: COLORS.gray1,
        borderWidth: trackBorderWidth
    },
    trackError: {
        borderColor: COLORS.redLight
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
        zIndex: 5
    },
    innerHandle: {
        width: innerHandleWidth,
        height: innerHandleHeight,
        backgroundColor: innerHandleColor,
        borderRadius: 50
    },
    tooltip: {
        position: "absolute",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: tooltipColor,
        paddingVertical: tooltipPaddingVertical
    },
    tooltipBottomTriangle: {
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
    tooltipText: {
        fontFamily: "Gilroy-Medium",
        fontWeight: "bold",
        fontSize: FONT_SIZES.p4,
        color: valueTextColor,
        textAlign: "center"
    }
});

export default React.memo(Slider);