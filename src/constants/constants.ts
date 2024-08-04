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
    checkMark: "check-circle-outline",
    eye: "eye-outline",
    eyeOff: "eye-off-outline",
}

export const ICON_COLORS = {
    default: theme.colors.white,
    good: theme.colors.greenLight,
    wrong: "red"
}

export const GLOBAL_STYLE = StyleSheet.create({
    pageContainer: {
        flex: 1,
        flexDirection: "column",
        gap: 10,
        backgroundColor: "whitesmoke",
    },
    scrollViewContentContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: "center",
        gap: hp(1.75)
    },
    formLinkText: {
        fontSize: hp(2),
        paddingLeft: hp(1.5),
        fontFamily: "Gilroy-Medium",
        color: theme.colors.fuelYellow
    },
});

export const COLLAPSIBLE_HEADER_HEIGHT = 180;
export const COLLAPSIBLE_HEADER_IMAGE = 110;

export const SIMPLE_HEADER_HEIGHT = 70;