import React, { ReactElement } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { InfoText, InfoTextProps } from "./InfoText.tsx";

export type InfoRowProps = InfoTextProps & {
    onPress?: () => void
    renderContent?: () => ReactElement
    containerStyle?: ViewStyle
    secondaryInfo?: InfoTextProps
}

export function InfoRow({
    onPress,
    renderContent,
    secondaryInfo,
    containerStyle,
    ...infoTextProps
}: InfoRowProps) {
    return (
        <View style={ { flex: 1 } }>
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
                   <View style={ { flexShrink: 1 } }>
                      <InfoText
                         subtitleStyle={ { textAlign: "right" } }
                         titleStyle={ { textAlign: "right" } }
                         { ...secondaryInfo }
                      />
                   </View>
                }
            </Pressable>
            <View style={ { paddingLeft: FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall } }>
                { renderContent && renderContent() }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    contentContainer: {
        flex: 1,
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