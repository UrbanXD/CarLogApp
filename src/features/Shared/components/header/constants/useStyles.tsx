import {StyleSheet} from "react-native";
import {DEFAULT_SEPARATOR, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT} from "../../../constants/constants";
import {theme} from "../../../constants/theme";

const useStyles = (top: number) =>
    StyleSheet.create({
        wrapper: {
            paddingTop: top
        },
        barContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall,
            height: SIMPLE_HEADER_HEIGHT,
            backgroundColor: theme.colors.black2,
            paddingTop: SEPARATOR_SIZES.lightSmall * 0.5,
            paddingHorizontal: DEFAULT_SEPARATOR,
            overflow: "hidden"
        },
        title: {
            fontFamily: "Gilroy-Heavy",
            fontSize:  FONT_SIZES.normal,
            color: theme.colors.white,
            letterSpacing: FONT_SIZES.normal * 0.05
        }
    })

export default useStyles;