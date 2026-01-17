import React, { ReactElement, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { InfoText, InfoTextProps } from "./InfoText.tsx";
import Icon from "../Icon.tsx";
import { debounce } from "es-toolkit";
import { ViewStyle } from "../../types/index.ts";

export type InfoRowProps = InfoTextProps & {
    onPress?: () => void
    renderContent?: () => ReactElement
    actionIcon?: string
    row?: boolean
    containerStyle?: ViewStyle
    secondaryInfo?: InfoTextProps
}

export function InfoRow({
    onPress,
    renderContent,
    actionIcon,
    row = true,
    secondaryInfo,
    containerStyle,
    ...infoTextProps
}: InfoRowProps) {
    const debouncedPress = useMemo(() => debounce(() => onPress?.(), 250), [onPress]);

    return (
        <View style={ { flex: 1 } }>
            <Pressable
                onPress={ debouncedPress }
                disabled={ !onPress }
                style={ [styles.container, containerStyle] }
            >
                {
                    infoTextProps.icon &&
                   <Icon
                      icon={ infoTextProps.icon }
                      size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                      color={ COLORS.white }
                   />
                }
                <View style={ [styles.contentContainer, row && styles.rowContentContainer] }>
                    <InfoText { ...infoTextProps } />
                    {
                        secondaryInfo &&
                       <InfoText
                          contentTextStyle={ row ? styles.rowContentText : undefined }
                          titleStyle={ row ? styles.rowContentText : undefined }
                          { ...secondaryInfo }
                       />
                    }
                </View>
                {
                    actionIcon &&
                   <Icon
                      icon={ actionIcon }
                      size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                      color={ COLORS.white }
                   />
                }
            </Pressable>
            {
                renderContent &&
               <View style={ { paddingLeft: FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE + SEPARATOR_SIZES.lightSmall } }>
                   { renderContent() }
               </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    contentContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    rowContentContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    rowContentText: {
        textAlign: "right"
    },
    textContainer: {
        flex: 1
    }
});