import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import Icon from "../Icon.tsx";
import { IntelligentMarquee } from "../marquee/IntelligentMarquee.tsx";
import React from "react";

export type InfoTextProps = {
    icon?: string
    title?: string
    subtitle?: string
    marquee?: boolean
    textContainerStyle?: ViewStyle
    iconStyle?: ViewStyle
    titleStyle?: TextStyle
    subtitleStyle?: TextStyle
}

export function InfoText({
    icon,
    title,
    subtitle,
    marquee,
    textContainerStyle,
    iconStyle,
    titleStyle,
    subtitleStyle
}: InfoTextProps) {
    return (
        <>
            {
                icon &&
               <Icon
                  icon={ icon }
                  size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                  color={ COLORS.white }
                  style={ iconStyle }
               />
            }
            <View style={ [styles.container, textContainerStyle] }>
                {
                    title && (
                        marquee
                        ?
                        <IntelligentMarquee
                            speed={ 0.65 }
                            delay={ 800 }
                            bounceDelay={ 800 }
                            spacing={ SEPARATOR_SIZES.lightSmall }
                        >
                            <Text style={ [styles.title, titleStyle] } numberOfLines={ 1 }>
                                { title }
                            </Text>
                        </IntelligentMarquee>
                        :
                        <Text style={ [styles.title, titleStyle] }>
                            { title }
                        </Text>
                    )
                }
                {
                    subtitle && (
                        marquee
                        ?
                        <IntelligentMarquee
                            speed={ 0.65 }
                            delay={ 800 }
                            bounceDelay={ 800 }
                            spacing={ SEPARATOR_SIZES.lightSmall }
                        >
                            <Text style={ [styles.subtitle, subtitleStyle] } numberOfLines={ 1 }>
                                { subtitle }
                            </Text>
                        </IntelligentMarquee>
                        :
                        <Text style={ [styles.subtitle, subtitleStyle] }>
                            { subtitle }
                        </Text>
                    )
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.05,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3 * 0.9,
        letterSpacing: FONT_SIZES.p3 * 0.9 * 0.05,
        color: COLORS.gray1
    }
});