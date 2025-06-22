import React from "react";
import { Dimensions, GestureResponderEvent, LayoutChangeEvent, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useInputFieldContext } from "../../../contexts/inputField/InputFieldContext.ts";

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
    const inputFieldContext = useInputFieldContext();
    const onChange = inputFieldContext?.field?.onChange;

    const trackWidth = useSharedValue(Dimensions.get("window").width);
    const thumbOffset = useSharedValue(0);
    const percent = useSharedValue(0);

    const calculatePercent = () => {
        percent.value = Math.round(Math.max(
            Math.min((thumbOffset.value / (trackWidth.value - 40 - 10)) * 100, 100),
            minValue
        ));
    };

    const updateValue = () => {
        let updatedValue = percent.value;
        if(maxValue) updatedValue = maxValue * (percent.value / 100);

        if(setValue) setValue(updatedValue);
        if(onChange) onChange(updatedValue);
        console.log(updatedValue, "updateValueSLider");
    };

    const pan = Gesture.Pan()
    .onChange((event) => {
        thumbOffset.value = Math.min(trackWidth.value - 40 - 10, Math.max(0, thumbOffset.value + event.changeX));
        runOnJS(calculatePercent)();
    })
    .onEnd(_event => {
        runOnJS(updateValue)();
    });

    const sliderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: thumbOffset.value }]
        };
    });

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width);
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        thumbOffset.value = Math.max(0, event.nativeEvent.locationX - 25);
        calculatePercent();
        updateValue();
    };

    return (
        <TouchableOpacity
            style={ styles.sliderTrack }
            onLayout={ onTrackLayout }
            onPress={ onTrackPress }
        >
            <GestureDetector gesture={ pan }>
                <Animated.View style={ [styles.sliderHandle, sliderStyle] }/>
            </GestureDetector>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 32
    },
    sliderTrack: {
        position: "relative",
        width: 260,
        height: 50,
        backgroundColor: "#82cab2",
        borderRadius: 25,
        justifyContent: "center",
        padding: 5
    },
    sliderHandle: {
        width: 40,
        height: 40,
        backgroundColor: "#f8f9ff",
        borderRadius: 20,
        position: "absolute",
        left: 5
    }
});

export default Slider;