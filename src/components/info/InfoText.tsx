import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { IntelligentMarquee } from "../marquee/IntelligentMarquee.tsx";
import React, { ReactElement } from "react";

export type InfoTextProps = {
    title?: string
    content?: string | ((textStyle?: Array<TextStyle>) => ReactElement)
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
        <View style={ [styles.container, contentFirst && styles.container.contentFirst, textContainerStyle] }>
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
        flex: 1,

        contentFirst: {
            flexDirection: "column-reverse"
        }
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