import React from "react";
import {IconSource} from "react-native-paper/lib/typescript/components/Icon";
import {StyleSheet, Text, TouchableOpacity} from "react-native";
import {Icon} from "react-native-paper";
import {FONT_SIZES, ICON_NAMES} from "../../constants/constants";
import {theme} from "../../constants/theme";

interface LinkProps {
    text?: string,
    icon?: IconSource
}

const Link: React.FC<LinkProps> = ({ text, icon }) => {
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
                        source={ icon }
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