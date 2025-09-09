import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from "react-hook-form";

export * from "./baseConfig.ts";
export * from "./colors.ts";
export * from "./icons.ts";
export * from "./fontSizes.ts";
export * from "../ui/alert/constants/index.ts";
export * from "./separatorSizes.ts";
export * from "./globalStyles.ts";

export interface ControllerRenderArgs {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<any>;
}

export const SIMPLE_HEADER_HEIGHT = hp(6.75);
export const SIMPLE_TABBAR_HEIGHT = hp(7.5);
export const ICON_FONT_SIZE_SCALE = 1.5;