import { StyleSheet, Text, View } from "react-native";
import { IntelligentMarquee } from "../../marquee/IntelligentMarquee.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { formatNumber } from "../../../utils/formatNumber.ts";
import Icon from "../../Icon.tsx";
import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Divider from "../../Divider.tsx";
import { DashedLine } from "./DashedLine.tsx";

type TimelineItemProps = {
    item?: any
    iconSize?: number
    isLast?: boolean
    isFirst?: boolean
}

const x = 25096701;

export function TimelineItem({
    item,
    isFirst,
    isLast,
    iconSize = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE
}: TimelineItemProps) {
    const styles = useStyles(iconSize * 1.25, isFirst, isLast);

    return (
        <View style={ styles.container }>
            <View style={ styles.title.container }>
                <IntelligentMarquee speed={ 0.30 } spacing={ SEPARATOR_SIZES.lightSmall }>
                    <Text style={ styles.title.text } numberOfLines={ 1 }>
                        { formatNumber(x, x >= 10000000000) }
                    </Text>
                </IntelligentMarquee>
                <Text style={ styles.title.text }>km</Text>
            </View>
            <View style={ styles.timeline }>
                <View style={ [styles.timeline.line.dot, isFirst && styles.timeline.line.iconDot] }>
                    {
                        isFirst &&
                       <Icon icon={ ICON_NAMES.fuelPump } size={ iconSize } color={ COLORS.black5 }/>
                    }
                </View>
                <DashedLine/>
                {/*<View style={ styles.timeline.line }/>*/ }
            </View>
            <View style={ styles.card }>
                <View style={ styles.card.title.container }>
                    <Text style={ styles.card.title.text } adjustsFontSizeToFit
                          numberOfLines={ 1 }>Kilométeróra-frissítés
                    </Text>
                    <Divider color={ COLORS.fuelYellow } style={ { width: "45%", alignSelf: "flex-start" } }/>
                </View>
                {
                    isFirst &&
                   <Text style={ styles.card.note }>
                      Ez itt egy note most itt. Nagyon fontos ez a note
                   </Text>
                }
                <Text style={ [styles.card.date] }>2025.09.19</Text>
            </View>
        </View>
    );
}

const useStyles = (dotSize: number, isFirstItem: boolean, isLastItem: boolean) => StyleSheet.create({
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
            color: COLORS.gray1,
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
                backgroundColor: COLORS.fuelYellow,
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
        borderColor: COLORS.gray4,
        borderWidth: 1.5,
        borderRadius: 12.5,
        borderTopLeftRadius: 0,

        title: {
            container: {
                gap: SEPARATOR_SIZES.lightSmall / 2
            },

            text: {
                fontFamily: "Gilroy-Heavy",
                fontSize: FONT_SIZES.p2,
                color: COLORS.white
            }
        },

        note: {
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p2,
            color: COLORS.white2,

            notFound: {
                color: COLORS.gray2
            }
        },

        date: {
            alignSelf: "flex-end",
            fontFamily: "Gilroy-Medium",
            fontSize: FONT_SIZES.p4,
            color: COLORS.gray2
        }
    }
});