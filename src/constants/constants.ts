import {StyleSheet} from "react-native";
import {theme} from "../styles/theme";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

export const ICON_NAMES = {
    email: "email-outline",
    password: "lock-outline",
    checkMark: "check-circle-outline"
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
    formContainer: {
        flex: 1,
        gap: 20,
        padding: 50,
        backgroundColor: theme.colors.primaryBackground4,
        borderTopLeftRadius: 125,
    },
    formLinkText: {
        fontSize: 20,
        paddingLeft: hp(1.5),
        fontFamily: "Gilroy-Medium",
        color: theme.colors.fuelYellow
    },
    inputContainer: {
        flexDirection: "column",
        gap: 5
    },
    inputName: {
        paddingLeft: hp(1.5),
        fontSize: hp(2.75),
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white
    },
    formFieldContainer: {
        minHeight: hp(6),
        maxHeight: hp(6),
        flexDirection: "row",
        alignItems: "center",
        gap: hp(1.5),
        backgroundColor: theme.colors.primaryBackground5,
        paddingHorizontal: hp(1.5),
        borderRadius: 20,
        overflow: "hidden"
    },
    activeFormFieldContainer: {
        borderWidth: 1,
        borderColor: theme.colors.grayLight
    },
    formFieldIconContainer: {
        flex: 0.2,
        alignItems: "center",
    },
    textInput: {
        flex: 1,
        color: theme.colors.grayLight,
        // fontFamily: "Gilroy-Medium",
        fontSize: hp(2.25)
    },
    placeholderText: {
        color: theme.colors.grayMedium
    }
});

export const COLLAPSIBLE_HEADER_HEIGHT = 180;
export const COLLAPSIBLE_HEADER_IMAGE = 110;

export const SIMPLE_HEADER_HEIGHT = 70;