import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Platform } from "react-native";

const size = (percentage: number, webPixels: number) => Platform.OS === "web" ? webPixels : hp(percentage);

export const SEPARATOR_SIZES = {
    lightSmall: size(1, 8),
    small: size(1.5, 12),
    mediumSmall: size(1.75, 14),
    normal: size(2.5, 20),
    medium: size(3, 24),
    extraMedium: size(5, 40),
    lightLarge: size(7.5, 48),
    large: size(8.5, 56)
};

export const DEFAULT_SEPARATOR = SEPARATOR_SIZES.small;
