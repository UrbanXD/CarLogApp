import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Dimensions, Platform } from "react-native";

const desktopWeb = Platform.OS === "web" && Dimensions.get("window").width >= 1040;
const size = (percentage: number, webPixels: number) => Platform.OS === "web"
                                                        ? webPixels * (desktopWeb ? 1.25 : 1)
                                                        : hp(percentage);

export const FONT_SIZES = {
    p4: size(1.75, 12),
    p3: size(2, 14),
    p2: size(2.25, 16),
    p1: size(2.75, 20),
    h3: size(3, 22),
    h2: size(3.5, 28),
    h1: size(5, 40),
    title: Platform.OS === "web" ? 48 * (desktopWeb ? 1.25 : 1) : wp(21.5)
};
