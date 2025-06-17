import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export const SEPARATOR_SIZES = {
    lightSmall: hp(1),
    small: hp(1.5),
    mediumSmall: hp(1.75),
    normal: hp(2.5),
    medium: hp(3),
    extraMedium: hp(5),
    lightLarge: hp(7.5),
    large: hp(8.5)
};

export const DEFAULT_SEPARATOR = SEPARATOR_SIZES.normal;