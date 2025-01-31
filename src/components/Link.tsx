import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FONT_SIZES } from "../constants/constants";
import { theme } from "../constants/theme";
import Icon from "./Icon";

interface LinkProps {
    text?: string,
    icon?: string
}

const Link: React.FC<LinkProps> = ({
    text,
    icon
}) => {
    return (
        <TouchableOpacity style={ styles.linkContainer }>
            {
                text &&
                <Text style={ styles.linkText }>
                    { text }
                </Text>
            }
            {
                icon &&
                <Icon
                    icon={ icon }
                    size={ styles.linkText.fontSize * 1.35 }
                    color={ styles.linkText.color }
                />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    linkText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small * 1.15,
        textAlign: "center",
        color: theme.colors.fuelYellow,
    },
})

export default Link;