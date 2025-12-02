import { View, ViewStyle } from "react-native";
import React from "react";

type PointerProps = {
    size: number
    color: string
    borderColor?: string
    borderWidth?: number
    style?: ViewStyle
}

export function Pointer({ size, color, borderColor, borderWidth, style }: PointerProps) {
    return (
        <View style={ [
            {
                width: size,
                height: size,
                borderRadius: 100,
                backgroundColor: color,
                borderColor: borderColor,
                borderWidth: borderWidth
            }, style
        ] }
        />
    );
}