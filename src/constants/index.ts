import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { SEPARATOR_SIZES } from "./separatorSizes.ts";

export * from "./baseConfig.ts";
export * from "./colors.ts";
export * from "./icons.ts";
export * from "./fontSizes.ts";
export * from "../ui/alert/constants/index.ts";
export * from "./separatorSizes.ts";
export * from "./globalStyles.ts";
export * from "./bottomSheetRoutes.ts";

export const SIMPLE_HEADER_HEIGHT = hp(6.75);
export const SIMPLE_TABBAR_HEIGHT = hp(7.5);
export const FLOATING_ACTION_BUTTON_SIZE = hp(6);
export const GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON = SEPARATOR_SIZES.lightSmall;
export const FULL_TABBAR_HEIGHT = SIMPLE_TABBAR_HEIGHT + FLOATING_ACTION_BUTTON_SIZE + GAP_BETWEEN_TABBAR_AND_FLOATING_ACTION_BUTTON;
export const ICON_FONT_SIZE_SCALE = 1.5;
export const MIN_DATE = "1950-01-01";
export const MAX_DATE = "2050-12-31";
export const MAX_EXCHANGE_RATE_DECIMAL = 6;