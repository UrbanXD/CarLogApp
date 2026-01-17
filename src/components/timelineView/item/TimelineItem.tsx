import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Icon from "../../Icon.tsx";
import React, { ReactNode } from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Divider from "../../Divider.tsx";
import { DashedLine } from "./DashedLine.tsx";
import { Color } from "../../../types/index.ts";
import getContrastingColor from "../../../utils/colors/getContrastingColor.ts";

export type TimelineItemType = Omit<TimelineItemProps, "isFirst" | "isLast" | "iconSize">

type TimelineItemProps = {
    id: string
    milestone: ReactNode
    title: string
    color?: Color
    icon?: string | null
    iconSize?: number
    iconColor?: Color
    note?: string | null
    footerText?: ReactNode
    isFirst: boolean
    isLast: boolean
    onPress?: () => void
}

export function TimelineItem({
    milestone,
    title,
    color = COLORS.gray2,
    icon,
    iconColor = getContrastingColor(color, COLORS.white, COLORS.gray5),
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    note,
    footerText,
    onPress,
    isFirst,
    isLast
}: TimelineItemProps) {
    const styles = useStyles(color, iconSize, isFirst, isLast);

    return (
        <View style={ styles.container }>
            <View style={ styles.timeline }>
                <View style={ [styles.dot, icon && styles.iconDot] }>
                    {
                        icon
                        ? <Icon icon={ icon } size={ iconSize / 1.5 } color={ iconColor }/>
                        : <View style={ {
                            width: "40%",
                            height: "40%",
                            backgroundColor: iconColor,
                            borderRadius: 100
                        } }/>
                    }
                </View>
                {
                    !isLast &&
                   <DashedLine/>
                }
            </View>
            <Pressable onPress={ onPress } disabled={ !onPress } style={ styles.card }>
                <View style={ styles.cardTitleContainer }>
                    {
                        typeof milestone === "string"
                        ? <Text style={ styles.cardTitle }>{ milestone }</Text>
                        : milestone
                    }
                    <Text style={ styles.cardSubtitle }>{ title }</Text>
                    <Divider
                        color={ color }
                        thickness={ 3 }
                        style={ { width: "45%", alignSelf: "flex-start" } }
                    />
                </View>
                {
                    note &&
                   <Text style={ styles.noteText }>{ note }</Text>
                }
                {
                    footerText && (
                        typeof footerText === "string"
                        ? <Text style={ styles.footerText }>{ footerText }</Text>
                        : footerText
                    )
                }
            </Pressable>
        </View>
    );
}

const useStyles = (color: Color, dotSize: number, isFirstItem: boolean, isLastItem: boolean) => StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        minHeight: heightPercentageToDP(10),
        width: "100%"
    },
    titleContainer: {
        width: "25%",
        marginTop: SEPARATOR_SIZES.small
    },
    title: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        color: COLORS.white2,
        textAlign: "center"
    },
    timeline: {
        flexDirection: "column",
        height: !isLastItem ? "100%" : dotSize + SEPARATOR_SIZES.lightSmall * (isFirstItem ? 2 : 1),
        width: dotSize + SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5,
        paddingTop: isFirstItem ? SEPARATOR_SIZES.lightSmall : undefined,
        borderTopLeftRadius: isFirstItem ? 7.5 : undefined,
        borderTopRightRadius: isFirstItem ? 7.5 : undefined,
        borderBottomLeftRadius: isLastItem ? 7.5 : undefined,
        borderBottomRightRadius: isLastItem ? 7.5 : undefined,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24
    },
    line: {
        flex: 1,
        width: 5,
        borderStyle: "dashed",
        borderRightWidth: 5,
        borderColor: COLORS.white,
        alignSelf: "center"
    },
    dot: {
        width: dotSize / 1.5,
        height: dotSize / 1.5,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        borderColor: COLORS.black2,
        borderWidth: 0.35,
        borderRadius: 100
    },
    iconDot: {
        width: dotSize,
        height: dotSize
    },
    card: {
        flex: 1,
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5,
        marginTop: dotSize / 2.5,
        padding: SEPARATOR_SIZES.lightSmall,
        borderRadius: 12.5,
        borderTopLeftRadius: 0,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24
    },
    cardTitleContainer: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    cardTitle: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2,
        color: COLORS.white
    },
    cardSubtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.white
    },
    noteText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1
    },
    noteNotFoundText: {
        color: COLORS.gray2
    },
    footerText: {
        alignSelf: "flex-end",
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p4,
        color: COLORS.gray1
    }
});