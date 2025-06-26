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
import { COLORS } from "../../../constants/index.ts";

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

    const calculatePercent = () => {
        percent.value = Math.round(Math.max(
            Math.min((thumbOffset.value / (trackWidth.value - SLIDER_HANDLE_WIDTH)) * 100, 100),
            0
        ));

        let updatedValue = percent.value;
        if(maxValue) updatedValue = Math.round(Math.max(maxValue * (percent.value / 100), minValue));

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

    const onTrackLayout = (event: LayoutChangeEvent) => {
        trackWidth.set(event.nativeEvent.layout.width);
    };

    const onTrackPress = (event: GestureResponderEvent) => {
        thumbOffset.value = Math.max(0, event.nativeEvent.locationX - SLIDER_HANDLE_WIDTH / 2);
        setTimeout(calculatePercent, 100);
        setTimeout(updateValue, 200);
    };

    return (
        <>
            <View
                style={ {
                    width: "100%",
                    height: SLIDER_HANDLE_HEIGHT,
                    justifyContent: "center"
                } }>
                <TouchableOpacity
                    style={ styles.sliderTrack }
                    onLayout={ onTrackLayout }
                    onPress={ onTrackPress }
                >
                    <Animated.View style={ [styles.sliderBar, sliderBarStyle] }>
                        <GestureDetector gesture={ pan }>
                            <Animated.View style={ [styles.sliderHandle] }/>
                        </GestureDetector>
                    </Animated.View>
                </TouchableOpacity>
            </View>
            <Text style={ { color: "white" } }>{ inputValue }</Text>
        </>
    );
};

const SLIDER_TRACK_HEIGHT = heightPercentageToDP(0.75);
const SLIDER_HANDLE_HEIGHT = heightPercentageToDP(3);
const SLIDER_HANDLE_WIDTH = heightPercentageToDP(2);

const styles = StyleSheet.create({
    sliderTrack: {
        position: "relative",
        height: SLIDER_TRACK_HEIGHT,
        backgroundColor: COLORS.gray3,
        borderRadius: 25,
        justifyContent: "center"
    },
    sliderBar: {
        position: "relative",
        backgroundColor: COLORS.gray1,
        height: "100%",
        minWidth: SLIDER_HANDLE_WIDTH / 2,
        borderRadius: 25
    },
    sliderHandle: {
        width: SLIDER_HANDLE_WIDTH,
        height: SLIDER_HANDLE_HEIGHT,
        backgroundColor: COLORS.gray1,
        alignSelf: "flex-end",
        borderRadius: 50,
        transform: [
            { translateX: SLIDER_HANDLE_WIDTH / 4 },
            { translateY: (SLIDER_TRACK_HEIGHT - SLIDER_HANDLE_HEIGHT) / 2 }
        ],
        zIndex: 5
    }
});

export default Slider;