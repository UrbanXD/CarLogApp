import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "../../../../components/Icon.tsx";
import Button from "../../../../components/Button/Button.ts";
import { Color } from "../../../../types/index.ts";
import { useTranslation } from "react-i18next";

export interface AlertModalProps {
    icon?: string;
    title?: string;
    body?: string;
    color?: Color;
    accept?: () => void;
    acceptText?: string;
    dismiss?: () => void;
    dismissText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    icon,
    title,
    body,
    color = COLORS.fuelYellow,
    accept = () => {},
    acceptText,
    dismiss = () => {},
    dismissText
}) => {
    const { t } = useTranslation();

    const iconSize = hp(10);

    const styles = useStyles(iconSize);

    return (
        <View testID="Modal" style={ styles.container }>
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
                        text={ acceptText ?? t("modal.accept") }
                        fontSize={ FONT_SIZES.p2 }
                        backgroundColor={ color }
                        onPress={ accept }
                    />
                    <Button.Text
                        text={ dismissText ?? t("modal.dismiss") }
                        backgroundColor={ "transparent" }
                        fontSize={ FONT_SIZES.p2 }
                        textColor={ color }
                        style={ { borderColor: color, borderWidth: 2.5 } }
                        onPress={ dismiss }
                    />
                </View>
            </View>
        </View>
    );
};

const useStyles = (iconSize: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "column",
            top: SIMPLE_HEADER_HEIGHT * 3,
            alignSelf: "center",
            width: "100%",
            minHeight: hp(25),
            backgroundColor: COLORS.black5,
            padding: SEPARATOR_SIZES.small,
            borderRadius: 35,
            zIndex: 2
        },
        iconContainer: {
            height: (iconSize * 1.45) / 1.85
        },
        icon: {
            position: "absolute",
            width: iconSize * 1.45,
            height: iconSize * 1.45,
            top: -iconSize / 1.35,
            alignSelf: "center",
            borderWidth: hp(1),
            borderColor: COLORS.black5
        },
        contentContainer: {
            flex: 1,
            gap: SEPARATOR_SIZES.normal
        },
        textContainer: {
            flex: 1,
            alignItems: "center"
        },
        titleText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: FONT_SIZES.h3,
            color: COLORS.white,
            lineHeight: FONT_SIZES.h3 * 1.25,
            letterSpacing: FONT_SIZES.h3 * 0.05,
            textAlign: "center"
        },
        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            color: COLORS.gray1,
            lineHeight: FONT_SIZES.p2 * 1.05,
            textAlign: "center"
        },
        buttonContainer: {
            gap: SEPARATOR_SIZES.small
        }
    });

export default React.memo(AlertModal);