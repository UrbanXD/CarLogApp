import React, { ReactNode, useState } from "react";
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { SharedValue, useAnimatedReaction } from "react-native-reanimated";
import { COLORS, DEFAULT_SEPARATOR, SEPARATOR_SIZES } from "../../constants";
import { ViewStyle } from "../../types";
import { scheduleOnRN } from "react-native-worklets";

type PopupViewProps = {
    opened: SharedValue<boolean>
    dismount?: boolean
    children?: ReactNode
    style?: ViewStyle
}

export function PopupView({ opened, children, style }: PopupViewProps) {
    const { width, height } = useWindowDimensions();
    const [visible, setVisible] = useState(opened.value);

    useAnimatedReaction(
        () => opened.value,
        (isOpened, previous) => {
            if(isOpened !== previous) scheduleOnRN(setVisible, isOpened);
        },
        [opened]
    );

    const close = () => opened.value = false;

    return (
        <Modal
            visible={ visible }
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={ close }
        >
            <View style={ styles.overlay }>
                <Pressable style={ StyleSheet.absoluteFill } onPress={ close } accessibilityRole="button"
                           accessibilityLabel="Close picker"/>
                <View style={ [
                    styles.popup,
                    style,
                    { width: Math.min(width - DEFAULT_SEPARATOR * 2, 760), maxHeight: height * 0.86 }
                ] }>
                    { children }
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: DEFAULT_SEPARATOR,
        backgroundColor: "rgba(0,0,0,.68)"
    },
    popup: {
        flexShrink: 1,
        overflow: "hidden",
        paddingHorizontal: SEPARATOR_SIZES.small,
        paddingVertical: DEFAULT_SEPARATOR,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.gray4,
        backgroundColor: COLORS.black5,
        zIndex: 10000
    }
});
