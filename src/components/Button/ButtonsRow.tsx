import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../constants/index.ts";
import { ViewStyle } from "../../types/index.ts";

interface ButtonsRowProps {
    style?: ViewStyle;
    children: ReactNode;
}

const ButtonsRow: React.FC<ButtonsRowProps> = ({
    style,
    children
}) => {
    return (
        <View style={ [styles.container, style] }>
            { children }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    }
});

export default ButtonsRow;