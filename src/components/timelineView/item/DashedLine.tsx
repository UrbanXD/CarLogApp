import React from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { COLORS } from "../../../constants/index.ts";
import { Color } from "../../../types/index.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";

type DashedLineProps = {
    lineHeight?: number
    lineWidth?: number
    color?: Color
    gap?: number
}

export function DashedLine({
    lineHeight = heightPercentageToDP(1.15),
    lineWidth = lineHeight / 2,
    color = COLORS.white,
    gap = heightPercentageToDP(0.55)
}: DashedLineProps) {
    const [height, setHeight] = React.useState(0);

    const lineCount = Math.floor(height / (lineHeight + gap));
    const lines = Array.from({ length: lineCount });

    const onLayout = (event: LayoutChangeEvent) => setHeight(event.nativeEvent.layout.height);

    const styles = useStyles(lineHeight, lineWidth, color);

    return (
        <View
            style={ styles.container }
            onLayout={ onLayout }
        >
            { lines.map((_, index) => <View key={ index } style={ styles.line }/>) }
        </View>
    );
}

const useStyles = (lineHeight: number, lineWidth: number, color: Color) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    },
    line: {
        height: lineHeight,
        width: lineWidth,
        backgroundColor: color
    }
});