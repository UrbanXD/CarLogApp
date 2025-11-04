import React from "react";
import { ColorValue, StyleSheet, View, ViewStyle } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { COLORS } from "../constants/index.ts";
import { Color } from "../types/index.ts";

type DividerProps = {
    size?: number
    thickness?: number
    color?: Color
    margin?: number
    isVertical?: boolean
    style?: ViewStyle
}

const Divider: React.FC<DividerProps> = ({
    isVertical = false,
    size = isVertical ? hp(100) : wp(100),
    thickness = 1,
    color = COLORS.white,
    margin = 0,
    style
}) => {
    const styles = useStyles(size, thickness, color, margin);

    return (
        <View style={ { overflow: "hidden" } }>
            <View style={ [isVertical ? styles.verticalLine : styles.horizontalLine, style] }/>
        </View>
    );
};

const useStyles = (size: number, thickness: number, color: ColorValue | string, margin: number) => {
    return StyleSheet.create({
        horizontalLine: {
            alignSelf: "center",
            width: size,
            height: thickness,
            marginVertical: margin,
            backgroundColor: color
        },
        verticalLine: {
            alignSelf: "center",
            width: thickness,
            height: size,
            marginHorizontal: margin,
            backgroundColor: color
        }
    });
};

export default Divider;