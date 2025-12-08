import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useEffect, useState } from "react";
import { ComparisonStatByDate, RideSummaryStat, TrendStat } from "../../model/dao/statisticsDao.ts";
import { formatTrend } from "../../utils/formatTrend.ts";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { StatCard } from "../StatCard.tsx";
import dayjs from "dayjs";
import { ChartTitle } from "../charts/common/ChartTitle.tsx";
import { BarChartView } from "../charts/BarChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { LineChartView } from "../charts/LineChartView.tsx";

type RideStatisticsProps = {
    carId?: string
    from: string
    to: string
}

export function RideStatistics({ carId, from, to }: RideStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [rideSummaryStat, setRideSummaryStat] = useState<RideSummaryStat | null>(null);
    const [rideFrequency, setRideFrequency] = useState<ComparisonStatByDate | null>(null);
    const [drivingActivity, setDrivingActivity] = useState<TrendStat | null>(null);

    useEffect(() => {
        (async () => {
            const statArgs = {
                carId: carId,
                from,
                to
            };

            const [
                resultRideSummary,
                resultRideFrequency,
                resultDrivingActivity
            ] = await Promise.all([
                statisticsDao.getRideSummary(statArgs),
                statisticsDao.getRideFrequency(statArgs),
                statisticsDao.getDrivingActivity(statArgs)
            ]);

            setRideSummaryStat(resultRideSummary);
            setRideFrequency(resultRideFrequency);
            setDrivingActivity(resultDrivingActivity);
        })();
    }, [carId, from, to]);

    const getCountOfRides = useCallback(() => {
        const { trend, trendSymbol } = rideSummaryStat?.distance.totalTrend ?? {};

        return {
            label: t("statistics.distance.count"),
            value: rideSummaryStat?.distance.count != null
                   ? `${ rideSummaryStat.distance.count } ${ t("common.count") }`
                   : null,
            isPositive: rideSummaryStat?.distance.countTrend.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

    const getTotalRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.total_ride_duration"),
            value: rideSummaryStat
                   ? dayjs.duration(rideSummaryStat.duration.total, "days").humanize()
                   : null,
            isPositive: rideSummaryStat?.duration?.totalTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.duration.totalTrend.trendSymbol } ${ rideSummaryStat.duration.totalTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);


    const getAverageRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.avg_ride_duration"),
            value: rideSummaryStat
                   ? dayjs.duration(rideSummaryStat.duration.average, "days").humanize()
                   : null,
            isPositive: rideSummaryStat?.duration?.averageTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.duration.averageTrend.trendSymbol } ${ rideSummaryStat.duration.averageTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);


    const getMedianRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.median_ride_duration"),
            value: rideSummaryStat
                   ? dayjs.duration(rideSummaryStat.duration.median, "days").humanize()
                   : null,
            isPositive: rideSummaryStat?.duration?.medianTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.duration.medianTrend.trendSymbol } ${ rideSummaryStat.duration.medianTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

    const getMaxRideDuration = useCallback(() => {
        return {
            label: t("statistics.distance.max_ride_duration"),
            value: rideSummaryStat?.duration.max != null
                   ? dayjs.duration(rideSummaryStat.duration.max.value, "days").humanize()
                   : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

    const getTotalDistanceByOdometer = useCallback(() => {
        return {
            label: t("statistics.distance.total_distance_by_odometer"),
            value: rideSummaryStat
                   ? formatWithUnit(
                    rideSummaryStat.distance.totalDistanceByOdometer,
                    rideSummaryStat.distance?.unitText
                )
                   : null,
            // isPositive: rideSummaryStat?.countTrend.isTrendPositive,
            isLoading: !rideSummaryStat
        };
    });

    const getTotalRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.total_ride_distance"),
            value: rideSummaryStat
                   ? formatWithUnit(rideSummaryStat.distance.total, rideSummaryStat.distance?.unitText)
                   : null,
            isPositive: rideSummaryStat?.distance?.totalTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.distance.totalTrend.trendSymbol } ${ rideSummaryStat.distance.totalTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);


    const getAverageRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.avg_ride_distance"),
            value: rideSummaryStat ? formatWithUnit(
                rideSummaryStat.distance.average,
                rideSummaryStat.distance?.unitText
            ) : null,
            isPositive: rideSummaryStat?.distance.averageTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.distance.averageTrend.trendSymbol } ${ rideSummaryStat.distance.averageTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);


    const getMedianRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.median_ride_distance"),
            value: rideSummaryStat
                   ? formatWithUnit(rideSummaryStat.distance.median, rideSummaryStat.distance?.unitText)
                   : null,
            isPositive: rideSummaryStat?.distance.medianTrend.isTrendPositive,
            trend: rideSummaryStat
                   ? `${ rideSummaryStat.distance.medianTrend.trendSymbol } ${ rideSummaryStat.distance.medianTrend.trend }`
                   : null,
            trendDescription: rideSummaryStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

    const getMaxRideDistance = useCallback(() => {
        return {
            label: t("statistics.distance.max_ride_distance"),
            value: rideSummaryStat?.distance.max != null
                   ? formatWithUnit(rideSummaryStat.distance.max.value, rideSummaryStat.distance?.unitText)
                   : null,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

    const getMostVisitedPlaces = useCallback(() => {
        let value: React.ReactNode = "-";

        if(rideSummaryStat && rideSummaryStat.distance.mostVisitedPlaces.length > 0) {
            value = (
                <>
                    { rideSummaryStat.distance.mostVisitedPlaces.map((place, index) => (
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
                            { rideSummaryStat.distance.mostVisitedPlaces.length - 1 !== index && "\n" }
                        </React.Fragment>
                    )) }
                </>
            );
        }

        return {
            label: t("statistics.distance.most_visited_places"),
            value,
            isLoading: !rideSummaryStat
        };
    }, [rideSummaryStat, t]);

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
                chartData={ rideFrequency?.barChartData }
                legend={ rideFrequency?.legend }
                title={ {
                    title: t("statistics.distance.ride_frequency")
                } }
                formatValue={ (value) => `${ value } ${ t("common.count") }` }
                formatYLabelAsValue={ false }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(rideFrequency?.rangeUnit))
                }
                showsLegend={ false }
                isLoading={ !rideFrequency }
            />
            <LineChartView
                chartData={ drivingActivity?.lineChartData }
                title={ {
                    title: t("statistics.distance.driving_activity")
                } }
                formatValue={ (value) => formatWithUnit(value, drivingActivity?.unitText) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(drivingActivity?.rangeUnit))
                }
                isLoading={ !drivingActivity }
            />
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));