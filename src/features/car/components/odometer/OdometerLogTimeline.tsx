import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../../components/timelineView/TimelineView.tsx";
import { TimelineItemType } from "../../../../components/timelineView/item/TimelineItem.tsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { OdometerLogType } from "../../model/enums/odometerLogType.ts";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Alert, StyleSheet, Text, View } from "react-native";
import { OdometerLogTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import useCars from "../../hooks/useCars.ts";
import Divider from "../../../../components/Divider.tsx";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Odometer } from "./Odometer.tsx";
import { OdometerText } from "./OdometerText.tsx";
import FloatingActionMenu from "../../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { router } from "expo-router";
import { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { odometerDao } = useDatabase();
    const paginator = useMemo(() => odometerDao.odometerLogPaginator(carId, 3), [carId]);
    const { getCar } = useCars();
    const car = useMemo(() => getCar(carId), [carId, getCar]);

    if(!car) return <></>;

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [scrolling, setScrolling] = useState(false);

    const scrollTimeout = useSharedValue(null);

    const odometerLogRowToTimelineItem = useCallback((odometerLogRow: OdometerLogTableRow): TimelineItemType => {
        let title = "Kilométeróra-frissítés";
        let color;
        let icon;
        let onPressInfo;

        switch(odometerLogRow?.type) {
            case OdometerLogType.SIMPLE:
                title = "Kilométeróra-frissítés";
                break;
            case OdometerLogType.FUEL:
                title = "Tankolás";
                icon = ICON_NAMES.fuelPump;
                color = COLORS.fuelYellow;
                onPressInfo = () => { Alert.alert("fuelocska"); };
                break;
            case OdometerLogType.SERVICE:
                title = "Szervíz";
                icon = ICON_NAMES.serviceOutline;
                color = COLORS.blueLight;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
        }

        return {
            milestone: odometerLogRow.value.toString(),
            renderMilestone: (milestone: string) =>
                <OdometerText
                    text={ milestone }
                    unit={ odometerLogRow.unit }
                    textStyle={ { color: COLORS.white } }
                    unitTextStyle={ { color: COLORS.white } }
                />,
            title,
            icon,
            color,
            note: odometerLogRow.note,
            footerText: dayjs(odometerLogRow.date).format("YYYY. MM DD."),
            onPressInfo
        };
    }, []);

    useEffect(() => {
        paginator.initial().then(result => {
            setData(result.map(odometerLogRowToTimelineItem));
        });
    }, []);

    const fetchMore = useCallback(() => {
        paginator.next().then(result => {
            if(!result) return;

            const newData = result.map(odometerLogRowToTimelineItem);
            setData(prevState => [...prevState, ...newData]);
        });
    }, [paginator]);

    const openCreateOdometerLog = useCallback(() => router.push("/bottomSheet/createOdometerLog"), []);

    const onScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            scheduleOnRN(setScrolling, true);
            if(scrollTimeout.value) clearTimeout(scrollTimeout.value);
        },
        onEndDrag: () => {
            if(scrollTimeout.value) clearTimeout(scrollTimeout.value);
            scrollTimeout.value = setTimeout(() => scheduleOnRN(setScrolling, false), 750);
        }
    });

    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.title }>{ car.name }</Text>
                <Text style={ styles.subtitle }>{ `${ car.model.make.name } ${ car.model.name }` }</Text>
                <Divider
                    thickness={ 5 }
                    size={ widthPercentageToDP(35) }
                    color={ COLORS.fuelYellow }
                    margin={ SEPARATOR_SIZES.lightSmall / 2 }
                    style={ styles.divider }
                />
                <Odometer value={ car.odometer.value } unit={ car.odometer.measurement }/>
            </View>
            <TimelineView
                title={ car.name }
                subtitle={ `${ car.model.make.name } ${ car.model.name }` }
                data={ data }
                fetchMore={ fetchMore }
                onScroll={ onScroll }
            />
            {
                !scrolling &&
               <FloatingActionMenu action={ openCreateOdometerLog }/>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.small
    },
    titleContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        lineHeight: FONT_SIZES.p1,
        color: COLORS.white
    },
    subtitle: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        lineHeight: FONT_SIZES.p2,
        color: COLORS.gray1,
        textAlign: "left"
    },
    divider: {
        alignSelf: "flex-start",
        marginLeft: SEPARATOR_SIZES.mediumSmall
    }
});