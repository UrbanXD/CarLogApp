import {StyleSheet} from "react-native";
import {theme} from "../styles/theme";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {UseFormHandleSubmit} from "react-hook-form";
import {SupabaseConnector} from "../db/SupabaseConnector";

export interface GetFormHandleSubmitArgs {
    handleSubmit: UseFormHandleSubmit<any>,
    supabaseConnector?: SupabaseConnector,
    onSubmit?: (...args: any[]) => void
}

export const ICON_NAMES = {
    email: "email-outline",
    password: "lock-outline",
    user: "account-outline",
    checkMark: "check-circle-outline",
    eye: "eye-outline",
    eyeOff: "eye-off-outline",
    pencil: "pencil-outline",
    rightArrowHead: "chevron-right",
    info: "information-outline",
    destinationPointMarker: "map-marker",
    startingPointMarker: "map-marker-outline",
    clock: "clock-time-seven-outline"
}

export const ICON_COLORS = {
    default: theme.colors.white,
    good: theme.colors.greenLight,
    wrong: "red"
}

export const FONT_SIZES = {
    extraSmall: hp(2),
    small: hp(2.25),
    normal: hp(3),//2.5
    medium: hp(3.5),
    large: hp(5),
    extraLarge: wp(22)
}

export const SEPARATOR_SIZES = {
    lightSmall: hp(1),
    small: hp(1.5),
    mediumSmall: hp(1.75),
    normal: hp(2.5),
    medium: hp(3),
    extraMedium: hp(5),
    lightLarge: hp(7.5),
    large: hp(8.5)
}

export const DEFAULT_SEPARATOR = SEPARATOR_SIZES.normal

export const GLOBAL_STYLE = StyleSheet.create({
    pageContainer: {
        flex: 1,
        flexDirection: "column",
        gap: 0,
        backgroundColor: "whitesmoke",
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: SEPARATOR_SIZES.small,
    },
    scrollViewContentContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        gap: SEPARATOR_SIZES.mediumSmall
    },
    formLinkText: {
        fontSize: FONT_SIZES.extraSmall,
        paddingLeft: SEPARATOR_SIZES.small,
        fontFamily: "Gilroy-Medium",
        color: theme.colors.fuelYellow
    },
});

export const GET_ICON_BUTTON_RESET_STYLE = (size: number = FONT_SIZES.normal) => {
    return { width: size, height: size, margin: 0 }
}

export const COLLAPSIBLE_HEADER_HEIGHT = 180;
export const COLLAPSIBLE_HEADER_IMAGE = 110;

export const SIMPLE_HEADER_HEIGHT = 70;