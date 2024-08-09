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
    ImageSourcePropType, View
} from "react-native";
import {theme} from "../../styles/theme";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {FONT_SIZES, SEPARATOR_SIZES} from "../../constants/constants";

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
                                icon &&
                                    <View style={{flex: 0.2}}><Image source={ icon } style={ styles.icon }></Image></View>
                            }
                            <Text style={ [styles.buttonText, textStyle] } >
                                { title }
                            </Text>
                            {
                                icon &&
                                    <View style={{flex: 0.2}}></View>
                            }
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
            paddingHorizontal: SEPARATOR_SIZES.lightSmall,
            width: "100%",
            height: hp(7),
            backgroundColor: secondaryColor,
            borderRadius: 30
        },
        buttonText: {
            flex: 1,
            // alignSelf: "center",
            textAlign: "center",
            fontSize: FONT_SIZES.normal,
            fontFamily: "Gilroy-Heavy",
            color: primaryColor,
            letterSpacing: FONT_SIZES.normal * 0.075,
        },
        icon: {
            alignSelf: "center",
            width: hp(4),
            height: hp(4)
        }
    })

export default Button