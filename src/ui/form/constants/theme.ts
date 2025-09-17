import { Color } from "../../../types/index.ts";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../../constants/index.ts";

type FormTheme = {
    valueTextColor: Color
    valueTextFontSize: number
    placeHolderColor: Color
    containerHeight: number
    containerBackgroundColor: Color
    containerPaddingHorizontal: number
    iconColor: Color
    iconSize: number
    borderRadius: number
    borderColor: Color
    errorColor: Color
    activeColor: Color
}
export const formTheme: FormTheme = {
    containerHeight: FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE + 2 * SEPARATOR_SIZES.lightSmall,
    containerBackgroundColor: COLORS.gray5,
    containerPaddingHorizontal: SEPARATOR_SIZES.lightSmall,
    valueTextColor: COLORS.gray1,
    valueTextFontSize: FONT_SIZES.p2,
    placeHolderColor: COLORS.gray2,
    iconColor: COLORS.gray1,
    iconSize: FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    borderRadius: 20,
    borderColor: COLORS.gray5,
    activeColor: COLORS.gray2,
    errorColor: COLORS.redLight
};