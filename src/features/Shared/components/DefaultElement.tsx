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
    activityIndicator?: boolean;
    icon?: string | ImageSourcePropType
    text?: string
    style?: StyleProp<ViewStyle>
}

const DefaultElement: React.FC<DefaultImageProps> = ({
    activityIndicator = false,
    icon = ICON_NAMES.image,
    text,
    style
}) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={ [styles.container, style] }>
                {
                    activityIndicator
                        ?   <ActivityIndicator
                                size={ FONT_SIZES.extraLarge }
                                color={ theme.colors.gray3 }
                            />
                        :   <Icon
                                icon={ icon }
                                size={ FONT_SIZES.extraLarge }
                                color={ theme.colors.gray3 }
                            />
                }
                {
                    text &&
                    <Text style={ styles.text }>
                        { text }
                    </Text>
                }
            </View>
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
        //
        backgroundColor: hexToRgba(theme.colors.gray5, 0.65),
        borderWidth: 0.5,
        borderRadius: 38,
        borderColor: theme.colors.gray5,
        paddingHorizontal: SEPARATOR_SIZES.small
    },
    text: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.intermediate,
        letterSpacing: FONT_SIZES.intermediate * 0.025,
        lineHeight: FONT_SIZES.intermediate * 1.25,
        color: theme.colors.gray2,
        textAlign: "center"
    }
})

export default DefaultElement;