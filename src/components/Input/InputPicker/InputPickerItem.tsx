import React from "react";
import Animated, {interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {Text, View} from "react-native";

interface InputPickerItemProps {
    index: number
    size: number
    coordinate: SharedValue<number>
    title: string
}

const InputPickerItem: React.FC<InputPickerItemProps> = ({ index, size, coordinate, title }) => {
    // const animatedStyle = useAnimatedStyle(() => {
    //     const scale = interpolate(
    //         coordinate.value,
    //         [size * (index - 1), size * index , size * (index + 1)],
    //         [0.9, 1, 0.9],
    //     );
    //
    //     return {
    //         transform: [{ scale }]
    //     };
    // });

    return (
        <View style={{height: size}}>
            <Animated.View style={[{ flex: 1,
                position: "relative",backgroundColor: "red" }]}>
                <Text style={{color: "blue"}}>
                    {title}
                </Text>
            </Animated.View>
        </View>
    )
}

export default InputPickerItem;