import { ColorValue, Image, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import React from "react";
import getContrastingColor from "../utils/colors/getContrastingColor";
import { COLORS } from "../constants/index.ts";
import { Color, ImageSource, ViewStyle } from "../types/index.ts";

interface IconProps {
    icon: ImageSource;
    size?: number;
    color?: Color;
    backgroundColor?: Color;
    style?: ViewStyle;
    onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({
    icon,
    size = hp(5),
    backgroundColor = "transparent",
    color = getContrastingColor(backgroundColor, COLORS.white, COLORS.black),
    style,
    onPress
}) => {
    const styles = useStyles(size, backgroundColor);

    return (
        <TouchableOpacity
            style={ [styles.container, style] }
            onPress={ onPress }
            disabled={ !onPress }
        >
            {
                typeof icon === "string"
                ? <MaterialIcon
                    name={ icon }
                    size={ size }
                    color={ color }
                />
                : <Image
                    source={ icon }
                    style={ styles.imageIcon }
                />
            }
        </TouchableOpacity>
    );
};

const useStyles = (size: number, backgroundColor: ColorValue | string) =>
    StyleSheet.create({
        container: {
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
            borderRadius: 100
        },
        imageIcon: {
            alignSelf: "center",
            width: size,
            height: size,
            backgroundColor
        }
    });

export default Icon;