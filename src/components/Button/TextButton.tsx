import React from "react";
import {
    ColorValue,
    ImageSourcePropType,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES} from "../../constants/constants";
import {theme} from "../../constants/theme";
import Icon from "../Icon";
import getContrastingColor from "../../utils/colors/getContrastingColor";

interface TextButtonProps {
    text?: string
    fontSize?: number
    textColor?: ColorValue
    backgroundColor?: ColorValue
    width?: number
    height?: number
    iconLeft?: ImageSourcePropType | string
    iconRight?: ImageSourcePropType | string
    style?: StyleProp<ViewStyle>
    inverse?: boolean
    disabled?: boolean
    onPress: () => void
}

const TextButton: React.FC<TextButtonProps> = ({
    text,
    fontSize = FONT_SIZES.normal,
    backgroundColor = theme.colors.fuelYellow,
    textColor = getContrastingColor(backgroundColor, theme.colors.white, theme.colors.black),
    height = hp(7),
    width,
    iconLeft,
    iconRight,
    style,
    inverse = false,
    disabled = false,
    onPress
}) => {
    const styles = useButtonStyles(
        !inverse ? backgroundColor : textColor,
        !inverse ? textColor : backgroundColor,
        width,
        height,
        fontSize
    );

    return (
        <TouchableOpacity
            onPress={ onPress }
            disabled={ disabled }
            style={ [styles.buttonContainer, style] }
        >
            {
                text &&
                <>
                    <View style={ [styles.sideSpacerContainer, { paddingLeft: SEPARATOR_SIZES.lightSmall }] }>
                        {
                            iconLeft &&
                            <Icon
                                icon={ iconLeft }
                                size={ fontSize * ICON_FONT_SIZE_SCALE * 0.85 }
                                color={ styles.buttonContainer.color }
                            />
                        }
                    </View>
                    <Text numberOfLines={ 2 } style={ styles.buttonText } >
                        { text }
                    </Text>
                    <View style={ [styles.sideSpacerContainer, { paddingRight: SEPARATOR_SIZES.lightSmall }] }>
                        {
                            iconRight &&
                            <Icon
                                icon={ iconRight }
                                size={ fontSize * ICON_FONT_SIZE_SCALE * 0.85 }
                                color={ styles.buttonContainer.color }
                            />
                        }
                    </View>
                </>
            }
        </TouchableOpacity>
    )
}

export const useButtonStyles = (
    primaryColor: ColorValue,
    secondaryColor: ColorValue,
    width: number | undefined ,
    height: number,
    fontSize: number
) =>
    StyleSheet.create({
        buttonContainer: {
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width ? 0 : SEPARATOR_SIZES.small,
            width: width ?? "100%",
            height: height,
            backgroundColor: primaryColor,
            color: secondaryColor,
            borderRadius: 30,
            overflow: "hidden"
        },
        buttonText: {
            flex: 1,
            // alignSelf: "center",
            textAlign: "center",
            fontSize: fontSize,
            fontFamily: "Gilroy-Heavy",
            color: secondaryColor,
            letterSpacing: fontSize * 0.075,
            flexWrap: "nowrap"

        },
        sideSpacerContainer: {
            height: "100%",
            width: fontSize * ICON_FONT_SIZE_SCALE * 0.85,
            justifyContent: "center",
            alignItems: "center",
        }
    })

export default TextButton;