import React from "react";
import { View, StyleSheet } from "react-native";
import {SEPARATOR_SIZES} from "../../Shared/constants/constants";

interface ButtonsRowProps {
    children: React.ReactNode;
}

const ButtonsRow: React.FC<ButtonsRowProps> = ({
    children
}) => {
    return (
        <View style={ styles.container }>
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