import { StyleSheet } from "react-native";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../constants/constants";
import { theme } from "../../../constants/theme";

const useHeaderStyles = (top: number) =>
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
            backgroundColor: GLOBAL_STYLE.pageContainer.backgroundColor,
            paddingTop: SEPARATOR_SIZES.lightSmall * 0.5,
            paddingHorizontal: DEFAULT_SEPARATOR,
            overflow: "hidden"
        },
        title: {
            fontFamily: "Gilroy-Heavy",
            fontSize:  FONT_SIZES.h3,
            color: theme.colors.white,
            letterSpacing: FONT_SIZES.h3 * 0.05
        }
    })

export default useHeaderStyles;