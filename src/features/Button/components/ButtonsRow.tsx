import React from "react";
import {View, StyleSheet, ViewStyle} from "react-native";
import {SEPARATOR_SIZES} from "../../Shared/constants/constants";

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
        paddingVertical: SEPARATOR_SIZES.normal,
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    }
})

export default ButtonsRow;