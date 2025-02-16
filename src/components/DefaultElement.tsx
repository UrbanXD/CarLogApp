import {
    ImageSourcePropType,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    Text, ActivityIndicator
} from "react-native";
import { theme } from "../constants/theme";
import {FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES} from "../constants/constants";
import Icon from "./Icon";
import { hexToRgba } from "../utils/colors/hexToRgba";
import React from "react";

interface DefaultImageProps {
    isLoading?: boolean;
    icon?: string | ImageSourcePropType
    text?: string
    loadingText?: string
    style?: StyleProp<ViewStyle>
}

const DefaultElement: React.FC<DefaultImageProps> = ({
    isLoading = false,
    icon = ICON_NAMES.image,
    text,
    loadingText = "Adatok betöltése...",
    style
}) => {
    return (
        <View style={ [styles.container, style] }>
            {
                isLoading
                    ?   <ActivityIndicator
                            size={ FONT_SIZES.title }
                            color={ theme.colors.gray3 }
                        />
                    :   <Icon
                            icon={ icon }
                            size={ FONT_SIZES.title }
                            color={ theme.colors.gray3 }
                        />
            }
            {
                isLoading
                    ? loadingText &&
                        <Text style={ styles.text }>
                            { loadingText }
                        </Text>
                    : text &&
                        <Text style={ styles.text }>
                            { text }
                        </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: hexToRgba(theme.colors.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray5,
        paddingHorizontal: SEPARATOR_SIZES.small
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.025,
        lineHeight: FONT_SIZES.p2 * 1.25,
        color: theme.colors.gray2,
        textAlign: "center"
    }
})

export default DefaultElement;