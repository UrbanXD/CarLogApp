import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { formatTrend } from "../../utils/formatTrend.ts";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants";
import { StatCard } from "../StatCard.tsx";
import dayjs from "dayjs";
import { ChartTitle } from "../charts/common/ChartTitle.tsx";
import { BarChartView } from "../charts/BarChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { LineChartView } from "../charts/LineChartView.tsx";
import { getRangeUnit } from "../../utils/getRangeUnit.ts";
import { useCar } from "../../../car/hooks/useCar.ts";
import { useWatchedQueryCollection } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { StatisticsFunctionArgs } from "../../../../database/dao/types/statistics.ts";

type RideStatisticsProps = {
    carId?: string | null
    from: string | null
    to: string | null
}

export function RideStatistics({ carId, from, to }: RideStatisticsProps) {
    const { t } = useTranslation();
    const { rideLogDao } = useDatabase();
    const { car } = useCar({ carId });

    const rangeUnit = useMemo(() => getRangeUnit(from, to), [from, to]);
    const carOdometerUnit = useMemo(() => car?.odometer.unit.short, [car?.odometer.unit]);

    const memoizedStatArgs: StatisticsFunctionArgs = useMemo(() => ({
        carId: carId,
        from,
        to
    }), [carId, from, to]);

    const memoizedMostVisitedPlacesQuery = useMemo(
        () => rideLogDao.mostVisitedPlacesStatisticsWatchedQueryCollection(memoizedStatArgs),
        [rideLogDao, memoizedStatArgs]
    );
    const { data: mostVisitedPlaces, isLoading: isMostVisitedPlacesLoading } = useWatchedQueryCollection(
        memoizedMostVisitedPlacesQuery);

    const memoizedSummaryByDistanceQuery = useMemo(
        () => rideLogDao.summaryStatisticsByDistanceWatchedQueryItem(memoizedStatArgs),
        [rideLogDao, memoizedStatArgs]
    );
    const { data: summaryByDistance, isLoading: isSummaryByDistanceLoading } = useWatchedQueryItem(
        memoizedSummaryByDistanceQuery);

    const memoizedSummaryByDurationQuery = useMemo(
        () => rideLogDao.summaryStatisticsByDurationWatchedQueryItem(memoizedStatArgs),
        [rideLogDao, memoizedStatArgs]
    );
    const { data: summaryByDuration, isLoading: isSummaryByDurationLoading } = useWatchedQueryItem(
        memoizedSummaryByDurationQuery);

    const memoizedRideFrequencyQuery = useMemo(
        () => rideLogDao.frequencyStatisticsWatchedQueryCollection(memoizedStatArgs),
        [rideLogDao, memoizedStatArgs]
    );
    const { data: rideFrequency, isLoading: isRideFrequencyLoading } = useWatchedQueryCollection(
        memoizedRideFrequencyQuery);

    const memoizedDrivingActivityQuery = useMemo(
        () => rideLogDao.drivingActivityStatisticsWatchedQueryCollection(memoizedStatArgs),
        [rideLogDao, memoizedStatArgs]
    );
    const { data: drivingActivity, isLoading: isDrivingActivityLoading } = useWatchedQueryCollection(
        memoizedDrivingActivityQuery);

    const getCountOfRides = useCallback(() => {
        const { trend, trendSymbol } = summaryByDistance?.countTrend ?? {};

        return {
            label: t("statistics.distance.count"),
            value: summaryByDistance?.count != null
                   ? `${ summaryByDistance.count } ${ t("common.count") }`
                   : null,
            isPositive: summaryByDistance?.countTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isSummaryByDistanceLoading
        };
    }, [summaryByDistance, isSummaryByDistanceLoading, t]);

    const getTotalRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.total_ride_duration"),
            value: summaryByDuration != null
                   ? summaryByDuration.total > 0 ? dayjs.duration(summaryByDuration.total, "days")
                .humanize() : "-"
                   : null,
            isPositive: summaryByDuration?.totalTrend?.isTrendPositive,
            trend: summaryByDuration != null
                   ? `${ summaryByDuration.totalTrend.trendSymbol } ${ summaryByDuration.totalTrend.trend }`
                   : null,
            trendDescription: summaryByDuration != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDurationLoading
        };
    }, [summaryByDuration, isSummaryByDurationLoading, t]);


    const getAverageRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.avg_ride_duration"),
            value: summaryByDuration != null
                   ? summaryByDuration.average > 0 ? dayjs.duration(summaryByDuration.average, "days")
                .humanize() : "-" : null,
            isPositive: summaryByDuration?.averageTrend?.isTrendPositive,
            trend: summaryByDuration != null
                   ? `${ summaryByDuration.averageTrend.trendSymbol } ${ summaryByDuration.averageTrend.trend }`
                   : null,
            trendDescription: summaryByDuration != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDurationLoading
        };
    }, [summaryByDuration, isSummaryByDurationLoading, t]);


    const getMedianRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.median_ride_duration"),
            value: summaryByDuration != null
                   ? summaryByDuration.median > 0 ? dayjs.duration(summaryByDuration.median, "days")
                .humanize() : "-" : null,
            isPositive: summaryByDuration?.medianTrend?.isTrendPositive,
            trend: summaryByDuration != null
                   ? `${ summaryByDuration.medianTrend.trendSymbol } ${ summaryByDuration.medianTrend.trend }`
                   : null,
            trendDescription: summaryByDuration != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDurationLoading
        };
    }, [summaryByDuration, isSummaryByDurationLoading, t]);

    const getMaxRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.max_ride_duration"),
            value: summaryByDuration?.max != null
                   ? summaryByDuration.max.value > 0 ? dayjs.duration(summaryByDuration.max.value, "days")
                .humanize() : "-" : null,
            isLoading: isSummaryByDurationLoading
        };
    }, [summaryByDuration, isSummaryByDurationLoading, t]);

    const getTotalRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.total_ride_distance"),
            value: summaryByDistance != null
                   ? formatWithUnit(summaryByDistance.total, carOdometerUnit)
                   : null,
            isPositive: summaryByDistance?.totalTrend?.isTrendPositive,
            trend: summaryByDistance != null
                   ? `${ summaryByDistance.totalTrend.trendSymbol } ${ summaryByDistance.totalTrend.trend }`
                   : null,
            trendDescription: summaryByDistance != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDistanceLoading
        };
    }, [summaryByDistance, isSummaryByDistanceLoading, carOdometerUnit, t]);


    const getAverageRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.avg_ride_distance"),
            value: summaryByDistance != null ? formatWithUnit(summaryByDistance.average, carOdometerUnit) : null,
            isPositive: summaryByDuration?.averageTrend?.isTrendPositive,
            trend: summaryByDistance != null
                   ? `${ summaryByDistance.averageTrend.trendSymbol } ${ summaryByDistance.averageTrend.trend }`
                   : null,
            trendDescription: summaryByDistance != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDistanceLoading
        };
    }, [summaryByDistance, isSummaryByDistanceLoading, carOdometerUnit, t]);


    const getMedianRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.median_ride_distance"),
            value: summaryByDistance != null
                   ? formatWithUnit(summaryByDistance.median, carOdometerUnit)
                   : null,
            isPositive: summaryByDistance?.medianTrend?.isTrendPositive,
            trend: summaryByDistance != null
                   ? `${ summaryByDistance.medianTrend.trendSymbol } ${ summaryByDistance.medianTrend.trend }`
                   : null,
            trendDescription: summaryByDistance != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByDistanceLoading
        };
    }, [summaryByDistance, isSummaryByDistanceLoading, carOdometerUnit, t]);

    const getMaxRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.max_ride_distance"),
            value: summaryByDistance?.max != null
                   ? formatWithUnit(summaryByDistance.max.value, carOdometerUnit)
                   : null,
            isLoading: isSummaryByDistanceLoading
        };
    }, [summaryByDistance, isSummaryByDistanceLoading, carOdometerUnit, t]);

    const getMostVisitedPlaces = useCallback(() => {
        let value: React.ReactNode = "-";

        if(mostVisitedPlaces && mostVisitedPlaces.length > 0) {
            value = (
                <>
                    {
                        mostVisitedPlaces.map((place, index) => (
                            <React.Fragment key={ place.name + index }>
                                { place.name }{ " " }
                                <Text
                                    style={ {
                                        fontFamily: "Gilroy-Medium",
                                        fontSize: FONT_SIZES.p3,
                                        color: COLORS.gray1
                                    } }
                                >
                                    (x{ place.count })
                                </Text>
                                { mostVisitedPlaces.length - 1 !== index && "\n" }
                            </React.Fragment>
                        ))
                    }
                </>
            );
        }

        return {
            label: t("statistics.distance.most_visited_places"),
            value,
            isLoading: isMostVisitedPlacesLoading
        };
    }, [mostVisitedPlaces, isMostVisitedPlacesLoading, t]);

    return (
        <View style={ styles.container }>
            <StatCard { ...getCountOfRides() } />
            <StatCard { ...getMostVisitedPlaces() } />
            <ChartTitle title={ t("statistics.distance.ride_distance") }/>
            <MasonryStatView
                column1={ [
                    getTotalRideDistance(),
                    getMaxRideDistance()
                ] }
                column2={ [
                    getAverageRideDistance(),
                    getMedianRideDistance()
                ] }
            />
            <ChartTitle title={ t("statistics.distance.duration") }/>
            <MasonryStatView
                column1={ [
                    getTotalRideDuration(),
                    getMaxRideDuration()
                ] }
                column2={ [
                    getAverageRideDuration(),
                    getMedianRideDuration()
                ] }
            />
            <BarChartView
                chartData={ rideFrequency?.chartData }
                legend={ rideFrequency?.legend }
                title={ {
                    title: t("statistics.distance.ride_frequency.title")
                } }
                yAxisTitle={ t("statistics.distance.ride_frequency.y_axis") }
                formatValue={ (value) => `${ value } ${ t("common.count") }` }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(rangeUnit))
                }
                showsLegend={ false }
                isLoading={ isRideFrequencyLoading }
            />
            <LineChartView
                chartData={ drivingActivity?.chartData }
                title={ {
                    title: t("statistics.distance.driving_activity.title")
                } }
                yAxisTitle={ t("statistics.distance.driving_activity.y_axis", { unit: carOdometerUnit }) }
                formatValue={ (value) => formatWithUnit(value, carOdometerUnit) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(rangeUnit))
                }
                isLoading={ isDrivingActivityLoading }
            />
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));