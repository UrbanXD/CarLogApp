import React from "react";
import { ColorValue, StyleSheet, View, Text } from "react-native";
import { theme } from "../constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface TextDividerProps {
    title: string
    color?: ColorValue | string
    lineHeight?: number
    marginVertical?: number
}

const TextDivider: React.FC<TextDividerProps> = ({
    title,
    color = theme.colors.white,
    lineHeight = 1,
    marginVertical = 0
}) => {
    const styles = useStyles(color, lineHeight, marginVertical);

    return (
        <View style={ styles.container }>
            <View style={ styles.line } />
            <Text style={ styles.text }>
                { title }
            </Text>
            <View style={ styles.line } />
        </View>
    )
}

const useStyles = (color: ColorValue, height: number, marginVertical: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: hp(1),
            marginVertical: marginVertical
        },
        line: {
            flex: 1,
            height: height,
            backgroundColor: color
        },
        text: {
            fontSize: hp(2.25),
            fontFamily: "Gilroy-Medium",
            // textTransform: "uppercase",
            color: color
        }
    })

export default TextDivider;