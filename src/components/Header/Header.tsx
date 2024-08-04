import React, { ReactNode } from "react";
import {ColorValue, ImageSourcePropType, StatusBar, StatusBarStyle, StyleSheet, View} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { SharedValue } from "react-native-reanimated";
import {CollapsibleHeaderBar, SimpleHeaderBar} from "./HeaderBar";
import {SIMPLE_HEADER_HEIGHT} from "../../constants/constants";

interface CustomHeaderProp {
    children?: ReactNode | null
    statusBarStyle?: StatusBarStyle | null | undefined
    statusbarColor?: ColorValue
    backgroundColor: ColorValue
    collapsible?: {
        image: ImageSourcePropType,
        imageHeight: SharedValue<number>
        gradientColors?: Array<string>
    }
    height?: SharedValue<number> | number
}

const Header: React.FC<CustomHeaderProp> = ({ children, statusBarStyle = "light-content", backgroundColor, statusbarColor = backgroundColor, height = SIMPLE_HEADER_HEIGHT, collapsible}) => {
    return (
        <View>
            <StatusBar barStyle={ statusBarStyle } backgroundColor={ statusbarColor } />
            {
                !!collapsible
                    ? <CollapsibleHeaderBar
                          backgroundColor={ backgroundColor }
                          height={ height }
                          image={ collapsible.image }
                          imageHeight={ collapsible.imageHeight }
                          gradientColors={ collapsible.gradientColors }
                          children={ children }
                      />
                    : <SimpleHeaderBar
                          backgroundColor={ backgroundColor }
                          height={ height }
                          children={ children }
                      />
            }
        </View>
    )
}

export default Header;