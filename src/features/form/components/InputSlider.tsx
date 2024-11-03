import React, {useState} from "react";
import Animated, {clamp, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import {Gesture, GestureDetector, GestureHandlerRootView} from "react-native-gesture-handler";
import {StyleSheet, View, Text, Dimensions} from "react-native";

interface InputSliderProps {
    initialValue?: number
    min: number
    max: number
    step: number
}

const InputSlider: React.FC<InputSliderProps> = ({
    min,
    initialValue = min,
    max,
    step
}) => {
    const WIDTH = Dimensions.get("window").width;
    const [value, setValue] = useState(0);
    const x = useSharedValue(0);
    const prevX = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value }
        ],
    }));

    const pan = Gesture.Pan()
        .minDistance(1)
        .onStart(() => {
            prevX.value = x.value;
            console.log(max - min, (100 / (max - min)), WIDTH / x.value);
        })
        .onUpdate((event) => {
            // console.log(event)
            x.value = clamp(
                prevX.value + event.translationX,
                -WIDTH / 2,
                WIDTH / 2
            );
            setValue(Math.round(x.value));
            // console.log(x.value, WIDTH)
        })
        .runOnJS(true);

    return (
        <GestureHandlerRootView style={styles.container}>
            <View>
                <Text style={{ color: "white" }}>
                    { value }
                </Text>
            </View>
            <GestureDetector gesture={pan}>
                    <Animated.View style={[animatedStyles, styles.box]} />
            </GestureDetector>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 40,
        height: 40,
        backgroundColor: '#b58df1',
        borderRadius: 20,
    },
});

export default InputSlider;