import React from "react";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../constants/constants";
import {IconButton} from "react-native-paper";
import {theme} from "../../constants/theme";
import {StyleSheet, Text, View} from "react-native";
import {IconSource} from "react-native-paper/lib/typescript/components/Icon";

interface RideInfoProps {
    text: string,
    icon: IconSource
}

const RideInfo: React.FC<RideInfoProps> = ({ text, icon }) => {
    return (
        <View style={ styles.container }>
            <IconButton
                icon={ icon }
                iconColor={ theme.colors.white }
                size={ styles.text.fontSize * 1.2 }
                style={ GET_ICON_BUTTON_RESET_STYLE(styles.text.fontSize * 1.2) }
            />
            <Text numberOfLines={ 2 } style={ styles.text }>
                { text }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        flex: 1,
        flexWrap: "wrap",
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        color: theme.colors.gray1
    }
})

export default RideInfo;