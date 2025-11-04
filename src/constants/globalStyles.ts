import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "./colors.ts";
import { SEPARATOR_SIZES } from "./separatorSizes.ts";
import { FONT_SIZES } from "./fontSizes.ts";

export const GLOBAL_STYLE = StyleSheet.create({
    scrollViewContentContainer: {
        flexGrow: 1,
        gap: SEPARATOR_SIZES.normal
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        gap: SEPARATOR_SIZES.mediumSmall
    },
    formLinkText: {
        fontSize: FONT_SIZES.p3,
        paddingLeft: SEPARATOR_SIZES.small,
        fontFamily: "Gilroy-Medium",
        color: COLORS.fuelYellow
    },
    contentContainer: {
        gap: SEPARATOR_SIZES.small,
        flexDirection: "column"
    },
    containerTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        letterSpacing: FONT_SIZES.p1 * 0.05,
        color: COLORS.white
    },
    containerText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: COLORS.gray1
    },
    rowContainer: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        height: hp(8.5),
        backgroundColor: COLORS.black2,
        borderRadius: 15,
        padding: SEPARATOR_SIZES.small
    },
    columnContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});