import React, { ReactNode } from "react";
import { ColorValue, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { SharedValue } from "react-native-reanimated";

interface CustomHeaderProp {
    children?: ReactNode | null
    statusbarColor?: ColorValue,
    backgroundColor: ColorValue,
    height?: SharedValue<number>
}

const CustomHeader: React.FC<CustomHeaderProp> = ({ children, backgroundColor, statusbarColor = backgroundColor, height = 60 }) => {
    const { top } = useSafeAreaInsets();

    return (
        <View
            style={{
                backgroundColor: statusbarColor,
                height: top,
                paddingTop: top
            }}
        >
            <Animated.View
                style={{
                    backgroundColor: backgroundColor,
                    height: height
                }}
            >
                { children }
            </Animated.View>
        </View>
    )
}

export default CustomHeader;