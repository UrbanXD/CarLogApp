import React, { ReactNode, useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ExpandableView } from "./expandableView/ExpandableView.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../constants";
import { TextStyle, ViewStyle } from "../types";
import Icon from "./Icon.tsx";
import { DebouncedPressable } from "./DebouncedPressable.tsx";

type SectionProps = {
    title: string
    subtitle?: string
    expandable?: boolean
    containerStyle?: ViewStyle
    titleStyle?: TextStyle
    subtitleStyle?: TextStyle
    children?: ReactNode
}

export function Section({
    title,
    subtitle,
    expandable = true,
    containerStyle,
    titleStyle,
    subtitleStyle,
    children
}: SectionProps) {
    const [isExpanded, setIsExpanded] = useState(!expandable);

    const onPress = useCallback(() => {
        if(!expandable) return;
        setIsExpanded(prev => !prev);
    }, [setIsExpanded, expandable]);

    return (
        <View style={ [styles.container, containerStyle] }>
            <DebouncedPressable
                onPress={ onPress }
                disabled={ !expandable }
                style={ styles.controllerContainer }
            >
                <View style={ { flexShrink: 1 } }>
                    <Text style={ [styles.title, titleStyle] }>
                        { title }
                    </Text>
                    {
                        subtitle &&
                       <Text style={ [styles.subtitle, subtitleStyle] }>
                           { subtitle }
                       </Text>
                    }
                </View>
                {
                    expandable &&
                   <Icon
                      icon={ isExpanded ? ICON_NAMES.upArrowHead : ICON_NAMES.downArrowHead }
                      size={ FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE }
                      color={ COLORS.white }
                   />
                }
            </DebouncedPressable>
            <ExpandableView expanded={ isExpanded } style={ { gap: SEPARATOR_SIZES.mediumSmall } }>
                { children }
            </ExpandableView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.small,
        flexDirection: "column",
        paddingBottom: SEPARATOR_SIZES.small,
        borderColor: COLORS.white2,
        borderBottomWidth: 0.35
    },
    controllerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall * 5
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        flexWrap: "wrap",
        fontSize: FONT_SIZES.p1,
        letterSpacing: FONT_SIZES.p1 * 0.035,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2 * 1.15,
        letterSpacing: FONT_SIZES.p2 * 0.035,
        color: COLORS.gray1
    }
});