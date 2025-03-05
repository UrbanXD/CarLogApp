import React from "react";
import { ActivityIndicator, ColorValue, ImageSourcePropType, Platform, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/constants";
import { Colors } from "../../constants/colors/Colors.ts";
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
    textStyle?: StyleProp<TextStyle>
    style?: StyleProp<ViewStyle>
    inverse?: boolean
    disabled?: boolean
    loadingIndicator?: boolean
    onPress: () => void
}

const TextButton: React.FC<TextButtonProps> = ({
    text,
    fontSize = FONT_SIZES.h3,
    backgroundColor = Colors.fuelYellow,
    textColor = getContrastingColor(backgroundColor, Colors.white, Colors.black),
    height = hp(6.5),
    width,
    iconLeft,
    iconRight,
    style,
    textStyle,
    inverse = false,
    disabled = false,
    loadingIndicator = false,
    onPress
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const styles = useButtonStyles(
        !inverse ? backgroundColor : textColor,
        !inverse ? textColor : backgroundColor,
        width,
        height,
        fontSize
    );

    const handlePress = async () => {
        setIsLoading(true);
        await onPress();
        setIsLoading(false);
    }

    return (
        <TouchableOpacity
            onPress={ handlePress }
            disabled={ disabled || isLoading }
            style={ [styles.buttonContainer, style] }
        >
            {
                loadingIndicator && isLoading &&
                <ActivityIndicator
                    size={
                        Platform.OS === "ios"
                            ? "large"
                            : styles.buttonContainer.height - SEPARATOR_SIZES.lightSmall
                    }
                    color={ !inverse ? textColor : backgroundColor }
                />
            }
            {
                text && ((loadingIndicator && !isLoading) || !loadingIndicator) &&
                <>
                    <View style={ styles.sideSpacerContainer }>
                        {
                            iconLeft &&
                            <Icon
                                icon={ iconLeft }
                                size={ fontSize * ICON_FONT_SIZE_SCALE * 0.85 }
                                color={ styles.buttonContainer.color }
                            />
                        }
                    </View>
                    <Text numberOfLines={ 2 } style={ [styles.buttonText, textStyle] } >
                        { text }
                    </Text>
                    <View style={ styles.sideSpacerContainer }>
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
            textAlign: "center",
            fontSize: fontSize,
            fontFamily: "Gilroy-Heavy",
            color: secondaryColor,
            letterSpacing: fontSize * 0.075,
            flexWrap: "nowrap"

        },
        sideSpacerContainer: {
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: fontSize * 0.25,
        }
    })

export default TextButton;