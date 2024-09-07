import React, { ReactNode } from "react";
import {ColorValue, ImageSourcePropType, StatusBar, StatusBarStyle, StyleSheet, Text, View} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { SharedValue } from "react-native-reanimated";
import {CollapsibleHeaderBar, SimpleHeaderBar} from "./HeaderBar";
import {DEFAULT_SEPARATOR, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT} from "../../constants/constants";
import {theme} from "../../constants/theme";
import {Avatar} from "react-native-paper";

// interface CustomHeaderProp {
//     children?: ReactNode | null
//     statusBarStyle?: StatusBarStyle | null | undefined
//     statusbarColor?: ColorValue
//     statusBarIsTransculent?: boolean
//     backgroundColor: ColorValue
//     collapsible?: {
//         image: ImageSourcePropType,
//         imageHeight: SharedValue<number>
//         gradientColors?: Array<string>
//     }
//     height?: SharedValue<number> | number
// }

interface CustomHeaderProps {
    children?: ReactNode | null,
    height?: number,
    backgroundColor?: ColorValue
}

interface CustomHeaderComponents extends React.FC<CustomHeaderProps>{
    StatusBar: React.FC<HeaderStatusBarProps>
    Row: React.FC<HeaderRowProps>
}

const Header: CustomHeaderComponents = ({
    children,
    height = SIMPLE_HEADER_HEIGHT,
    backgroundColor = theme.colors.black2,
    ...props
    // statusBarStyle = "light-content",
    // statusBarIsTransculent = false,
    // backgroundColor,
    // statusbarColor = backgroundColor,
    // height = SIMPLE_HEADER_HEIGHT,
    // collapsible,
    // ...props
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ height, backgroundColor, paddingTop: insets.top }} {...props}>
            { children }
        </View>
    )
}

interface HeaderStatusBarProps {
    translucent?: boolean
    barStyle?: StatusBarStyle | null | undefined
    backgroundColor?: ColorValue
}

Header.StatusBar = ({ translucent = false, barStyle = "light-content", backgroundColor = theme.colors.black2}: HeaderStatusBarProps) => {
    return (
        <StatusBar
            translucent={ translucent }
            barStyle={ barStyle }
            backgroundColor={ backgroundColor }
        />
    )
}

interface HeaderRowProps {
    children?: ReactNode | null
    backgroundColor?: ColorValue
    paddingRight?: number
    flex?: number
}

Header.Row = ({ children, backgroundColor = "transparent", flex = 1, paddingRight = DEFAULT_SEPARATOR }: HeaderRowProps) => {
    return (
        <View style={ [styles.barContainer, { flex, backgroundColor, paddingRight }] }>
            { children }
        </View>
    )
}

const styles = StyleSheet.create({
    barContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingTop: SEPARATOR_SIZES.lightSmall * 0.5,
        paddingHorizontal: DEFAULT_SEPARATOR,
        overflow: "hidden"
    }
})

export default Header;