import React from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {SEPARATOR_SIZES} from "../../constants/constants";

interface ButtonsRowProps {
    style?: ViewStyle
    children: React.ReactNode
}

const ButtonsRow: React.FC<ButtonsRowProps> = ({
    style,
    children
}) => {
    return (
        <View style={ [styles.container, style] }>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    }
})

export default ButtonsRow;