import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";

type InputRowProps = {
    children?: ReactElement;
}

export function InputRow({ children }: InputRowProps) {
    return (
        <View style={ styles.container }>
            { children }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.small
    }
});