import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {FONT_SIZES, SEPARATOR_SIZES} from "../../constants/constants";
import {theme} from "../../styles/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";

interface DateProps {
    dateTitle: string
    dateSubtitle: string
    flexDirection?: "row" | "column"
}

const Date: React.FC<DateProps> = ({ dateTitle, dateSubtitle, flexDirection = "column" }) => {
    return (
        <View style={ [styles.container, { flexDirection, gap: flexDirection === "row" ? SEPARATOR_SIZES.lightSmall * 0.5 : 0 }] }>
            <Text style={ styles.dateTitleText }>
                { dateTitle }
            </Text>
            <Text style={ styles.dateSubtitleText }>
                { dateSubtitle }
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: hp(11),
        justifyContent: "center",
        alignItems: "center",
    },
    dateTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        letterSpacing: FONT_SIZES.normal * 0.05,
        color: theme.colors.white
    },
    dateSubtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        letterSpacing: FONT_SIZES.small * 0.035,
        color: theme.colors.gray1
    }
})

export default Date;