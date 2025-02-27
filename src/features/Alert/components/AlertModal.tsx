import React from "react";
import {ImageSourcePropType, StyleSheet, View, Text, ColorValue} from "react-native";
import Animated from "react-native-reanimated";
import {
    FONT_SIZES,
    SEPARATOR_SIZES,
    SIMPLE_HEADER_HEIGHT
} from "../../Shared/constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../Shared/constants/theme";
import Icon from "../../Shared/components/Icon";
import Button from "../../Button/components/Button";

export interface AlertModalProps {
    icon?: string
    title?: string
    body?: string
    color?: ColorValue | string
    accept?: () => void
    acceptText?: string
    dismiss?: () => void
    dismissText?: string
}

const AlertModal: React.FC<AlertModalProps> = ({
    icon,
    title,
    body,
    color = theme.colors.fuelYellow,
    accept = () => {},
    acceptText= "Folytatás",
    dismiss = () => {},
    dismissText= "Mégse",
}) => {
    const iconSize = hp(11.5);

    const styles = useStyles(iconSize);

    return (
        // <Animated.View>
            <View style={ styles.container }>
                {
                    icon &&
                    <View style={ styles.iconContainer }>
                        <Icon
                            icon={ icon }
                            size={ iconSize }
                            backgroundColor={ color }
                            style={ styles.icon }
                        />
                    </View>
                }
                <View style={ styles.contentContainer }>
                    <View style={ styles.textContainer }>
                        {
                            title &&
                            <Text style={ styles.titleText }>
                                { title }
                            </Text>
                        }
                        {
                            body &&
                            <Text style={ styles.text }>
                                { body }
                            </Text>
                        }
                    </View>
                    <View style={ styles.buttonContainer }>
                        <Button.Text
                            text={ acceptText }
                            fontSize={ FONT_SIZES.small }
                            backgroundColor={ color }
                            height={ hp(5.5) }
                            onPress={ accept }
                        />
                        <Button.Text
                            text={ dismissText }
                            height={ hp(5.5) }
                            backgroundColor={ "transparent" }
                            fontSize={ FONT_SIZES.small }
                            textColor={ color }
                            style={{ borderColor: color, borderWidth: 2.5 }}
                            onPress={ dismiss }
                        />
                    </View>
                </View>
            </View>
        // </Animated.View>
    )
}

const useStyles = (iconSize: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "column",
            top: SIMPLE_HEADER_HEIGHT * 3,
            alignSelf: "center",
            width: "100%",
            minHeight: hp(25),
            backgroundColor: theme.colors.black5,
            padding: SEPARATOR_SIZES.small,
            borderRadius: 35,
            zIndex: 2
        },
        iconContainer: {
            height: (iconSize * 1.45) / 1.85,
        },
        icon: {
            position: "absolute",
            width: iconSize * 1.45,
            height: iconSize * 1.45,
            top: -iconSize / 1.35,
            alignSelf: "center",
            borderWidth: hp(1),
            borderColor: theme.colors.black5
        },
        contentContainer: {
            flex: 1,
            gap: SEPARATOR_SIZES.normal
        },
        textContainer: {
            flex: 1,
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall
        },
        titleText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.normal,
            color: theme.colors.white,
            lineHeight: FONT_SIZES.normal,
            letterSpacing: FONT_SIZES.normal * 0.05,
            textAlign: "center"
        },
        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.small,
            color: theme.colors.gray1,
            lineHeight: FONT_SIZES.small * 1.35,
            textAlign: "center"
        },
        buttonContainer: {
            gap: SEPARATOR_SIZES.small,
        },
    })

export default React.memo(AlertModal);