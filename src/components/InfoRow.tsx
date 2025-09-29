import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../constants/index.ts";
import Icon from "./Icon.tsx";
import { IntelligentMarquee } from "./marquee/IntelligentMarquee.tsx";

type InfoRowProps = {
    icon?: string
    title?: string
    subtitle?: string
    marquee?: boolean
    containerStyle?: ViewStyle
    iconStyle?: ViewStyle
    textContainerStyle?: ViewStyle
    titleStyle?: TextStyle
    subtitleStyle?: TextStyle
}

export function InfoRow({
    icon,
    title,
    subtitle,
    marquee,
    containerStyle,
    iconStyle,
    textContainerStyle,
    titleStyle,
    subtitleStyle
}: InfoRowProps) {
    return (
        <View style={ [styles.container, containerStyle] }>
            {
                icon &&
               <Icon
                  icon={ icon }
                  size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                  color={ COLORS.white }
                  style={ iconStyle }
               />
            }
            <View style={ [styles.textContainer, textContainerStyle] }>
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
                            <Text style={ [styles.textContainer.title, titleStyle] } numberOfLines={ 1 }>
                                { title }
                            </Text>
                        </IntelligentMarquee>
                        :
                        <Text style={ [styles.textContainer.title, titleStyle] }>
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
                            <Text style={ [styles.textContainer.subtitle, subtitleStyle] } numberOfLines={ 1 }>
                                { subtitle }
                            </Text>
                        </IntelligentMarquee>
                        :
                        <Text style={ [styles.textContainer.subtitle, subtitleStyle] }>
                            { subtitle }
                        </Text>
                    )
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    textContainer: {
        flex: 1,

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
    }
});