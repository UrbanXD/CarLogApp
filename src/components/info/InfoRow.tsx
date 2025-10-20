import React from "react";
import { Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { InfoText, InfoTextProps } from "./InfoText.tsx";

type InfoRowItem = {
    icon?: string
    title?: string
    subtitle?: string
    marquee?: boolean
    textContainerStyle?: ViewStyle
    titleStyle?: TextStyle
    subtitleStyle?: TextStyle
}

export type InfoRowProps = InfoTextProps & {
    onPress?: () => void
    containerStyle?: ViewStyle
    secondaryInfo?: InfoTextProps
}

export function InfoRow({
    onPress,
    secondaryInfo,
    containerStyle,
    ...infoTextProps
}: InfoRowProps) {
    return (
        <Pressable
            onPress={ onPress }
            disabled={ !onPress }
            style={ [styles.container, containerStyle] }
        >
            <View style={ styles.contentContainer }>
                <InfoText { ...infoTextProps } />
            </View>
            {
                secondaryInfo &&
               <View style={ [styles.contentContainer, styles.contentContainer.secondary] }>
                  <InfoText
                     subtitleStyle={ { textAlign: "right" } }
                     titleStyle={ { textAlign: "right" } }
                     { ...secondaryInfo }
                  />
               </View>
            }
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between"
    },
    contentContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall,

        secondary: {
            flexDirection: "row-reverse"
        }
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