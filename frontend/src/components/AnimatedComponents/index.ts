import Animated from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { Pressable } from "react-native";

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);
export const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);