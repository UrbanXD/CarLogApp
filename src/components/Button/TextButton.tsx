import React from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import Icon from "../Icon";
import getContrastingColor from "../../utils/colors/getContrastingColor";
import { Color, ImageSource } from "../../types/index.ts";

interface TextButtonProps {
    text?: string;
    fontSize?: number;
    textColor?: Color;
    backgroundColor?: Color;
    width?: number;
    height?: number;
    iconLeft?: ImageSource;
    iconRight?: ImageSource;
    textStyle?: TextStyle;
    style?: ViewStyle;
    inverse?: boolean;
    disabled?: boolean;
    loadingIndicator?: boolean;
    onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({
    text,
    fontSize = FONT_SIZES.h3,
    backgroundColor = COLORS.fuelYellow,
    textColor = getContrastingColor(backgroundColor, COLORS.white, COLORS.black),
    height = hp(6),
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
    };

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
                    {
                        (iconLeft || iconRight) &&
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
                    }
                   <Text numberOfLines={ 2 } style={ [styles.buttonText, textStyle] }>
                       { text }
                   </Text>
                    {
                        (iconLeft || iconRight) &&
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
                    }
                </>
            }
        </TouchableOpacity>
    );
};

export const useButtonStyles = (
    primaryColor: Color,
    secondaryColor: Color,
    width: number | undefined,
    height: number,
    fontSize: number
) =>
    StyleSheet.create({
        buttonContainer: {
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: SEPARATOR_SIZES.small,
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
            flexWrap: "nowrap",
            marginHorizontal: SEPARATOR_SIZES.lightSmall

        },
        sideSpacerContainer: {
            flex: 0.15,
            height: "100%",
            justifyContent: "center",
            alignItems: "center"
        }
    });

export default TextButton;