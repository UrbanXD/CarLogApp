import React from "react";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import Animated, {interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {theme} from "../../constants/theme";

interface BackdropProps {
    top: SharedValue<number>
    openHeight: number
    closeHeight: number
    close: () => void
}

const Backdrop: React.FC<BackdropProps> = ({ top, openHeight, closeHeight, close }) => {
    const animationStyle = useAnimatedStyle(() => {
        const opacity = interpolate(top.value, [closeHeight, openHeight], [0, 0.5]);
        const display = opacity === 0 ? "none" : "flex";

        return {
            opacity,
            display
        }
    })

    return (
        <TouchableWithoutFeedback onPress={ () => close() } >
            <Animated.View style={ [styles.container, animationStyle] } />
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.black,
        display: "none",
        zIndex: 98
    }
})

export default Backdrop;