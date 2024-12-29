import {
    StyleProp,
    StyleSheet,
    View, ViewStyle
} from "react-native";
import { theme } from "../constants/theme";
import { FONT_SIZES, ICON_NAMES } from "../constants/constants";
import Icon from "./Icon";
import { hexToRgba } from "../utils/colors/hexToRgba";
import React from "react";

interface DefaultImageProps {
    style?: StyleProp<ViewStyle>
}

const DefaultImage: React.FC<DefaultImageProps> = ({
    style
}) => {
    return (
        <View style={ [styles.container, style] }>
            <Icon
                icon={ ICON_NAMES.image }
                size={ FONT_SIZES.extraLarge }
                color={ theme.colors.gray4 }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(theme.colors.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray4
    }
})

export default DefaultImage;