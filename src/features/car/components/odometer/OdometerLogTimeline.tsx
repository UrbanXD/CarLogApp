import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../../components/timelineView/TimelineView.tsx";
import { TimelineItemType } from "../../../../components/timelineView/item/TimelineItem.tsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { StyleSheet, Text, View } from "react-native";
import useCars from "../../hooks/useCars.ts";
import Divider from "../../../../components/Divider.tsx";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Odometer } from "./Odometer.tsx";
import FloatingActionMenu from "../../../../ui/floatingActionMenu/components/FloatingActionMenu.tsx";
import { router } from "expo-router";
import { useOdometerTimelineItem } from "../../hooks/useOdometerTimelineItem.tsx";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { odometerDao } = useDatabase();
    const { getCar } = useCars();
    const { mapper } = useOdometerTimelineItem();

    const paginator = useMemo(() => odometerDao.odometerLogPaginator(carId), [carId]);
    const car = useMemo(() => getCar(carId), [carId, getCar]);

    if(!car) return <></>;

    const [data, setData] = useState<Array<TimelineItemType>>([]);
    const [isInitialFetching, setIsInitialFetching] = useState(true);
    const [isNextFetching, setIsNextFetching] = useState(false);
    const [isPreviousFetching, setIsPreviousFetching] = useState(false);

    useEffect(() => {
        paginator.initial().then(result => {
            setData((_) => {
                setIsInitialFetching(false);
                return result.map(mapper);
            });
        });
    }, []);

    const fetchNext = useCallback(async () => {
        if(!paginator.hasNext()) return;

        setIsNextFetching(true);
        const result = await paginator.next();
        if(!result) return setIsNextFetching(false);

        const newData = result.map(mapper);

        setData(prevState => {
            setIsNextFetching(false);
            return [...prevState, ...newData];
        });
    }, [paginator]);

    const fetchPrevious = useCallback(async () => {
        if(!paginator.hasPrevious()) return;

        setIsPreviousFetching(true);
        const result = await paginator.previous();

        if(!result) return setIsPreviousFetching(false);

        const newData = result.map(mapper);
        setData(prevState => {
            setIsPreviousFetching(false);
            return [...newData, ...prevState];
        });
    }, [paginator]);

    const openCreateOdometerLog = useCallback(() => router.push("/bottomSheet/createOdometerLog"), []);

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
                isInitialFetching={ isInitialFetching }
                fetchNext={ paginator.hasNext() && fetchNext }
                fetchPrevious={ paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
            />
            <FloatingActionMenu action={ openCreateOdometerLog }/>
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