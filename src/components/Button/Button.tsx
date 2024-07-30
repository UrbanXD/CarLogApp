import React, {ReactNode} from "react";
import {
    TouchableOpacity,
    Text,
    ColorValue,
    ViewStyle,
    StyleProp,
    TextStyle,
    StyleSheet,
    Image,
    ImageSourcePropType
} from "react-native";
import {theme} from "../../styles/theme";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";

interface ButtonCommonProps {
    onPress: () => void
    buttonStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    backgroundColor?: ColorValue
}

type ButtonConditionalProps =
    |   {
            title: string
            icon?: ImageSourcePropType
            textColor?: ColorValue
            inverse?: boolean
        }
    |   {
            title: ReactNode
            icon?: never
            textColor?: never
            inverse?: never
        }


type ButtonProps = ButtonCommonProps & ButtonConditionalProps

const Button: React.FC<ButtonProps> = ({ onPress, buttonStyle, textStyle, title, icon, backgroundColor= theme.colors.primaryBackground3, textColor = theme.colors.fuelYellow, inverse = false}) => {
    const styles = useStyles(!inverse ? backgroundColor : textColor, !inverse ? textColor : backgroundColor);
    return (
        <TouchableOpacity onPress={ onPress } style={ [styles.buttonContainer, buttonStyle] }>
            {
                typeof title === "string"
                    ? (
                        <>
                            {
                                icon && <Image source={ icon } style={ styles.icon }></Image>
                            }
                            <Text style={ [styles.buttonText, textStyle] } >
                                { title }
                            </Text>
                        </>
                      )
                    : title
            }
        </TouchableOpacity>
    )
}

const useStyles = (primaryColor: ColorValue, secondaryColor: ColorValue) =>
    StyleSheet.create({
        buttonContainer: {
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: hp(3.5),
            width: wp(85),
            height: hp(7),
            backgroundColor: secondaryColor,
            borderRadius: 30
        },
        buttonText: {
            fontSize: hp(3),
            fontFamily: "Gilroy-Heavy",
            color: primaryColor,
            letterSpacing: 30 * 0.075,
        },
        icon: {
            position: "absolute",
            left: hp(2),
            width: hp(4),
            height: hp(4)
        }
    })

export default Button