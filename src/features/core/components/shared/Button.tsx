import React from "react";
import {
    TouchableOpacity,
    Text,
    ColorValue,
    StyleSheet,
    Image,
    ImageSourcePropType, View
} from "react-native";
import { theme } from "../../constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../constants/constants";
import { Icon } from "react-native-paper";

interface ButtonCommonProps {
    onPress: () => void
    width?: number
    height?: number
    backgroundColor?: ColorValue
    textColor?: ColorValue
    rectangular?: boolean
    inverse?: boolean
    disabled?: boolean
}

type ButtonOptionalProps =
    |   {
            title?: string
            icon?: never
            iconLeft?: ImageSourcePropType | string
            iconRight?: ImageSourcePropType | string
            fontSize?: number
            iconSize?: never
        }
    |   {
            title?: undefined
            icon?: ImageSourcePropType | string
            iconLeft?: never
            iconRight?: never
            fontSize?: never
            iconSize?: number
        }

const Button: React.FC<ButtonCommonProps & ButtonOptionalProps> = ({
    onPress,
    title,
    icon,
    iconLeft,
    iconRight,
    height = hp(7),
    width,
    backgroundColor= theme.colors.black,
    textColor = theme.colors.fuelYellow,
    fontSize = FONT_SIZES.normal,
    iconSize= FONT_SIZES.medium,
    rectangular = false,
    inverse = false,
    disabled = false
}) => {
    const renderIcon = (icon: ImageSourcePropType | string) =>
        (typeof icon === "string")
            ? <Icon source={ icon } size={ styles.icon.width * 1.5 } />
            : <Image source={ icon } style={ styles.icon } />

    const styles =
        useStyles(
            !inverse ? backgroundColor : textColor,
            !inverse ? textColor : backgroundColor,
            rectangular,
            width,
            height,
            fontSize,
            iconSize
        );

    return (
        <TouchableOpacity
            onPress={ onPress }
            disabled={ disabled }
            style={ styles.buttonContainer }
        >
            {
                title
                    ?   <>
                            <View style={ styles.sideSpacerContainer }>
                                {
                                    iconLeft &&
                                    renderIcon(iconLeft)
                                }
                            </View>
                            <Text numberOfLines={ 2 } style={ styles.buttonText } >
                                { title }
                            </Text>
                            <View style={ styles.sideSpacerContainer }>
                                {
                                    iconRight && renderIcon(iconRight)
                                }
                            </View>
                        </>
                    :   icon && renderIcon(icon)
            }
        </TouchableOpacity>
    )
}

const useStyles = (primaryColor: ColorValue, secondaryColor: ColorValue, isRectangular: boolean, width: number | undefined , height: number, fontSize: number, iconSize: number) =>
    StyleSheet.create({
        buttonContainer: {
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: width ? 0 : SEPARATOR_SIZES.small,
            width: width ?? "100%",
            height: height,
            backgroundColor: secondaryColor,
            borderRadius: isRectangular ? 0 : 30
        },
        buttonText: {
            flex: 1,
            // alignSelf: "center",
            textAlign: "center",
            fontSize: fontSize,
            fontFamily: "Gilroy-Heavy",
            color: primaryColor,
            letterSpacing: fontSize * 0.075,
            flexWrap: "nowrap"

        },
        sideSpacerContainer: {
            height: "100%",
            width: iconSize,
            justifyContent: "center",
        },
        icon: {
            alignSelf: "center",
            width: iconSize,
            height: iconSize
        }
    })

interface CustomButtonProps {
    onPress: () => void
}

export const GoogleButton: React.FC<CustomButtonProps> = ({ onPress }) => {
    return (
        <Button
            onPress={ onPress }
            title="Folytatás Google fiókkal"
            iconLeft={ require("../../../../assets/images/google_logo.png") }
            inverse
            backgroundColor={ theme.colors.white }
            textColor={ theme.colors.googleRed }
            fontSize={ hp(2.35) }
        />
    )
}

export const FacebookButton: React.FC<CustomButtonProps> = ({ onPress }) => {
    return (
        <Button
            onPress={ onPress }
            title="Folytatás Facebook fiókkal"
            iconLeft={ require("../../../../assets/images/facebook_logo.png") }
            backgroundColor={ theme.colors.facebookBlue }
            textColor={ theme.colors.white }
            fontSize={ hp(2.35) }
        />
    )
}

export const ProgressBackButton: React.FC<CustomButtonProps> = ({ onPress }) => {
    return (
        <Button
            onPress={ onPress }
            icon={ ICON_NAMES.leftArrowHead }
            iconSize={ FONT_SIZES.normal * 0.85 * 1.5 }
            width={ hp(7) }
            height={ hp(7) }
            disabled={ false }

        />
    )
}

interface ProgressNextButtonProps {
    isLastStep: boolean
}

export const ProgressNextButton: React.FC<CustomButtonProps & ProgressNextButtonProps> = ({ onPress, isLastStep }) => {
    return (
        <Button
            onPress={ onPress }
            title={ !isLastStep ? "Következő" : "Befejezés" }
            fontSize={ FONT_SIZES.normal * 0.85 }
            iconRight={ !isLastStep ? ICON_NAMES.rightArrowHead : undefined }
            // iconSize={ FONT_SIZES.normal }
        />
    )
}

export default Button;