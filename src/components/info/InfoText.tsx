import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { IntelligentMarquee } from "../marquee/IntelligentMarquee.tsx";
import React, { ReactElement } from "react";
import { TextStyle, ViewStyle } from "../../types/index.ts";

export type InfoTextProps = {
    icon?: string
    title?: string
    content?: string | ((textStyle?: TextStyle) => ReactElement | null)
    contentFirst?: boolean
    marquee?: boolean
    textContainerStyle?: ViewStyle
    titleStyle?: TextStyle
    contentTextStyle?: TextStyle
}

export function InfoText({
    title,
    content,
    contentFirst,
    marquee,
    textContainerStyle,
    titleStyle,
    contentTextStyle
}: InfoTextProps) {
    return (
        <View
            style={ [styles.container, contentFirst && styles.contentFirstContainer, textContainerStyle] }>
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
                content && (
                    typeof content === "string"
                    ? (
                        marquee
                        ?
                        <IntelligentMarquee
                            speed={ 0.65 }
                            delay={ 800 }
                            bounceDelay={ 800 }
                            spacing={ SEPARATOR_SIZES.lightSmall }
                        >
                            <Text style={ [styles.content, contentTextStyle] } numberOfLines={ 1 }>
                                { content }
                            </Text>
                        </IntelligentMarquee>
                        :
                        <Text style={ [styles.content, contentTextStyle] }>
                            { content }
                        </Text>
                    )
                    : content([styles.content, contentTextStyle])
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentFirstContainer: {
        flexDirection: "column-reverse"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p3,
        letterSpacing: FONT_SIZES.p3 * 0.05,
        color: COLORS.white
    },
    content: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3 * 0.9,
        letterSpacing: FONT_SIZES.p3 * 0.9 * 0.05,
        color: COLORS.gray1
    }
});