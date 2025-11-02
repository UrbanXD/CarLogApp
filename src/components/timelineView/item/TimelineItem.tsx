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
    milestone: string
    title: string
    color?: Color
    icon?: string
    iconSize?: number
    iconColor?: Color
    note?: string
    footerText?: ReactNode
    isFirst: boolean
    isLast: boolean
    onPress?: () => void
    renderMilestone?: (milestone: string) => ReactNode
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
    isLast,
    renderMilestone
}: TimelineItemProps) {
    const styles = useStyles(color, iconSize, isFirst, isLast);

    return (
        <View style={ styles.container }>
            <View style={ styles.timeline }>
                <View style={ [styles.timeline.line.dot, icon && styles.timeline.line.iconDot] }>
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
                <View style={ styles.card.title.container }>
                    {
                        renderMilestone
                        ? renderMilestone(milestone)
                        : <Text style={ styles.card.title.text }>{ milestone }</Text>
                    }
                    <Text style={ styles.card.subtitle }>{ title }</Text>
                    <Divider
                        color={ color }
                        thickness={ 3 }
                        style={ { width: "45%", alignSelf: "flex-start" } }
                    />
                </View>
                {
                    note &&
                   <Text style={ styles.card.note }>{ note }</Text>
                }
                {
                    footerText && (
                        typeof footerText === "string"
                        ? <Text style={ styles.card.footerText }></Text>
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

    title: {
        container: {
            width: "25%",
            marginTop: SEPARATOR_SIZES.small
        },

        text: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            color: COLORS.white2,
            textAlign: "center"
        }
    },

    timeline: {
        flexDirection: "column",
        height: !isLastItem ? "100%" : dotSize + SEPARATOR_SIZES.lightSmall,
        width: dotSize + SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5,
        paddingTop: isFirstItem && SEPARATOR_SIZES.lightSmall,
        borderTopLeftRadius: isFirstItem && 7.5,
        borderTopRightRadius: isFirstItem && 7.5,
        borderBottomLeftRadius: isLastItem && 7.5,
        borderBottomRightRadius: isLastItem && 7.5,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24,

        line: {
            flex: 1,
            width: 5,
            borderStyle: "dashed",
            borderRightWidth: 5,
            borderColor: COLORS.white,
            alignSelf: "center",

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
            }
        }
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
        elevation: 24,

        title: {
            container: {
                flex: 1,
                gap: SEPARATOR_SIZES.lightSmall / 2
            },

            text: {
                fontFamily: "Gilroy-Heavy",
                fontSize: FONT_SIZES.p2,
                lineHeight: FONT_SIZES.p2,
                color: COLORS.white
            }
        },

        subtitle: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p3,
            color: COLORS.white
        },

        note: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p3,
            color: COLORS.gray1,

            notFound: {
                color: COLORS.gray2
            }
        },

        footerText: {
            alignSelf: "flex-end",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            color: COLORS.gray1
        }
    }
});