import React from "react";
import {StyleSheet, TouchableWithoutFeedback, View} from "react-native";
import Animated, {interpolate, SharedValue, useAnimatedStyle} from "react-native-reanimated";
import {theme} from "../../constants/theme";
import hexToRgba from "hex-to-rgba";
import {useBottomSheetModal} from "@gorhom/bottom-sheet";

interface BackdropProps {
}

const Backdrop: React.FC<BackdropProps> = ({ }) => {
    const { dismiss } = useBottomSheetModal();

    return (
        <TouchableWithoutFeedback onPress={ () => dismiss() } >
            <View style={ styles.container } />
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: hexToRgba(theme.colors.black, 0.5),
        // zIndex: 2
    }
})

export default Backdrop;