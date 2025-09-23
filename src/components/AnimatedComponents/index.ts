import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);
export const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);