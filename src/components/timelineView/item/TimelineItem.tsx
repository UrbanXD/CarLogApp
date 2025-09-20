import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Icon from "../../Icon.tsx";
import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Divider from "../../Divider.tsx";
import { DashedLine } from "./DashedLine.tsx";
import Button from "../../Button/Button.ts";
import { Color } from "../../../types/index.ts";

export type TimelineItemType = Omit<TimelineItemProps, "isFirst" | "isLast" | "iconSize">

type TimelineItemProps = {
    milestone: string
    title: string
    color?: Color
    icon?: string
    iconSize?: number
    iconColor?: Color
    note?: string
    footerText?: string
    isFirst: boolean
    isLast: boolean
    onPressInfo?: () => void
}

export function TimelineItem({
    milestone,
    title,
    color = COLORS.fuelYellow,
    icon,
    iconColor = COLORS.black5,
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE,
    note,
    footerText,
    onPressInfo,
    isFirst,
    isLast
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
                <DashedLine/>
            </View>
            <View style={ styles.card }>
                <View style={ {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: SEPARATOR_SIZES.lightSmall
                } }>
                    <View style={ styles.card.title.container }>
                        <Text style={ styles.card.title.text }>{ milestone }</Text>
                        <Text style={ styles.card.subtitle }>{ title }</Text>
                        {
                            (note || footerText) &&
                           <Divider color={ color } style={ { width: "45%", alignSelf: "flex-start" } }/> }
                    </View>
                    {
                        onPressInfo &&
                       <Button.Icon
                          icon={ ICON_NAMES.info }
                          iconSize={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                          width={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                          height={ FONT_SIZES.p2 * ICON_FONT_SIZE_SCALE }
                          style={ { alignSelf: "flex-start" } }
                          backgroundColor={ "transparent" }
                          iconColor={ COLORS.white }
                          onPress={ onPressInfo }
                       />
                    }
                </View>
                {
                    note &&
                   <Text style={ styles.card.note }>{ note }</Text>
                }
                {
                    footerText &&
                   <Text style={ [styles.card.date, !note && { alignSelf: "flex-end" }] }>{ footerText }</Text>
                }
            </View>
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
        height: "100%",
        width: dotSize + SEPARATOR_SIZES.lightSmall,
        backgroundColor: COLORS.gray5,
        paddingTop: isFirstItem && SEPARATOR_SIZES.lightSmall,
        borderTopLeftRadius: isFirstItem && 7.5,
        borderTopRightRadius: isFirstItem && 7.5,
        borderBottomLeftRadius: isLastItem && 7.5,
        borderBottomRightRadius: isLastItem && 7.5,

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
                borderWidth: 1,
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
        marginTop: SEPARATOR_SIZES.small,
        padding: SEPARATOR_SIZES.lightSmall,
        borderColor: color,
        borderWidth: 1.5,
        borderRadius: 12.5,
        borderTopLeftRadius: 0,

        title: {
            container: {
                flex: 1,
                gap: SEPARATOR_SIZES.lightSmall / 2
            },

            text: {
                fontFamily: "Gilroy-Heavy",
                fontSize: FONT_SIZES.p1,
                lineHeight: FONT_SIZES.p1,
                color: COLORS.white
            }
        },

        subtitle: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
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

        date: {
            alignSelf: "flex-end",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            color: COLORS.gray1
        }
    }
});