import React, { ReactElement, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants";
import { InfoText, InfoTextProps } from "./InfoText.tsx";
import Icon from "../Icon.tsx";
import { debounce } from "es-toolkit";
import { ViewStyle } from "../../types";

export type InfoRowProps = InfoTextProps & {
    onPress?: () => void
    renderContent?: () => ReactElement
    actionIcon?: string
    row?: boolean
    isLoading?: boolean
    containerStyle?: ViewStyle
    secondaryInfo?: InfoTextProps
}

export function InfoRow({
    onPress,
    renderContent,
    actionIcon,
    row = true,
    isLoading,
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
                    <InfoText
                        isLoading={ isLoading }
                        loadingIndicatorStyle={ styles.loadingIndicator }
                        { ...infoTextProps }
                    />
                    {
                        secondaryInfo &&
                       <InfoText
                          isLoading={ isLoading }
                          titleStyle={ row && styles.rowContentText }
                          contentTextStyle={ row && styles.rowContentText }
                          loadingIndicatorStyle={ row ? styles.rowLoadingIndicator : styles.loadingIndicator }
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
    loadingIndicator: {
        alignSelf: "flex-start"
    },
    rowContentContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    rowLoadingIndicator: {
        alignSelf: "flex-end"
    },
    rowContentText: {
        textAlign: "right"
    },
    textContainer: {
        flex: 1
    }
});