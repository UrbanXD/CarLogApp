import Divider from "../Divider.tsx";
import { COLORS, FONT_SIZES, ICON_FONT_SIZE_SCALE, SEPARATOR_SIZES } from "../../constants/index.ts";
import { StyleSheet, Text, View } from "react-native";
import React, { useCallback } from "react";
import { widthPercentageToDP } from "react-native-responsive-screen";
import useCars from "../../features/car/hooks/useCars.ts";
import { TimelineItem } from "./item/TimelineItem.tsx";

type TimelineViewProps = {
    title: string
    // paginator: Paginator
    dashed?: boolean
}

const DOT_ICON_SIZE = FONT_SIZES.p1 * ICON_FONT_SIZE_SCALE;

export function TimelineView() {
    const items = [0, 1, 2, 3];
    const { cars } = useCars();

    const renderItem = useCallback((index: number) => {
        return (<TimelineItem item={ null } iconSize={ DOT_ICON_SIZE } isFirst={ index === 0 }
                              isLast={ index + 1 === items.length }/>);
    }, []);

    return (
        <View style={ { flex: 1, gap: SEPARATOR_SIZES.extraMedium } }>
            <View style={ { gap: SEPARATOR_SIZES.lightSmall } }>
                <Text style={ styles.title }>{ cars[0].name }</Text>
                <Divider
                    thickness={ 6 }
                    size={ widthPercentageToDP(25) }
                    color={ COLORS.fuelYellow }
                    style={ styles.divider }
                />
            </View>
            <View style={ { gap: SEPARATOR_SIZES.lightSmall } }>
                <Text style={ styles.subtitle }>
                    { `${ cars[0].model.make.name } ${ cars[0].model.name }` }
                </Text>
                <View>
                    { renderItem(0) }
                    { renderItem(1) }
                    { renderItem(2) }
                    { renderItem(3) }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        lineHeight: FONT_SIZES.h2,
        color: COLORS.white2
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.h3,
        lineHeight: FONT_SIZES.h3,
        color: COLORS.white2,
        textAlign: "left"
        // marginRight: widthPercentageToDP(26.5)
    },
    divider: {
        alignSelf: "flex-start",
        marginLeft: SEPARATOR_SIZES.mediumSmall
    }
});