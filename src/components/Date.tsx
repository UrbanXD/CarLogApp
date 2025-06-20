import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface DateProps {
    dateTitle: string;
    dateUpperSubtitle?: string;
    dateUnderSubtitle?: string;
    flexDirection?: "row" | "column";
}

const Date: React.FC<DateProps> = ({
    dateTitle,
    dateUnderSubtitle,
    dateUpperSubtitle,
    flexDirection = "column"
}) => {
    const styles = useStyles(flexDirection);

    return (
        <View style={ styles.container }>
            {
                dateUpperSubtitle &&
                <Text style={ styles.dateSubtitleText }>
                    { dateUpperSubtitle }
                </Text>
            }
            <Text style={ styles.dateTitleText }>
                { dateTitle }
            </Text>
            {
                dateUnderSubtitle &&
                <Text style={ styles.dateSubtitleText }>
                    { dateUnderSubtitle }
                </Text>
            }
        </View>
    );
};

const useStyles = (flexDirection: "row" | "column") =>
    StyleSheet.create({
        container: {
            width: hp(11),
            justifyContent: "center",
            alignItems: "center",
            flexDirection,
            gap: flexDirection === "row" ? SEPARATOR_SIZES.lightSmall * 0.5 : 0
        },
        dateTitleText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.p1,
            letterSpacing: FONT_SIZES.p1 * 0.05,
            color: COLORS.white
        },
        dateSubtitleText: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            letterSpacing: FONT_SIZES.p2 * 0.035,
            color: COLORS.gray1
        }
    });

export default Date;