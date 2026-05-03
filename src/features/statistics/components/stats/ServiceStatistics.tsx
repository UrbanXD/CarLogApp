import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { BarChartView } from "../charts/BarChartView.tsx";
import dayjs from "dayjs";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatTrend } from "../../utils/formatTrend.ts";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { StatCard } from "../StatCard.tsx";
import { ServiceForecastView } from "../forecasts/ServiceForecastView.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants";
import { useWatchedQueryCollection } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { useCar } from "../../../car/hooks/useCar.ts";
import { getRangeUnit } from "../../utils/getRangeUnit.ts";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { StatisticsFunctionArgs } from "../../../../database/dao/types/statistics.ts";

const SERVICE_FREQUENCY_INTERVAL = 25000;

type ServiceStatisticsProps = {
    carId?: string | null
    from: string | null
    to: string | null
}

export function ServiceStatistics({ carId, from, to }: ServiceStatisticsProps) {
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();

    const { car } = useCar({ carId });

    const rangeUnit = useMemo(() => getRangeUnit(from, to), [from, to]);
    const carCurrency = useMemo(() => car?.currency.symbol, [car?.currency]);
    const carOdometerUnit = useMemo(() => car?.odometer.unit.short, [car?.odometer.unit]);

    const memoizedStatArgs: StatisticsFunctionArgs = useMemo(() => ({
        carId: carId,
        from,
        to
    }), [carId, from, to]);

    const memoizedSummaryByAmountQuery = useMemo(
        () => serviceLogDao.summaryStatisticsByAmountWatchedQueryItem(memoizedStatArgs),
        [serviceLogDao, memoizedStatArgs]
    );
    const { data: summaryByAmount, isLoading: isSummaryByAmountLoading } = useWatchedQueryItem(
        memoizedSummaryByAmountQuery);

    const memoizedStatisticsBetweenServicesQuery = useMemo(
        () => serviceLogDao.statisticsBetweenServicesWatchedQueryItem(memoizedStatArgs),
        [serviceLogDao, memoizedStatArgs]
    );
    const { data: statisticsBetweenServices, isLoading: isStatisticsBetweenServicesLoading } = useWatchedQueryItem(
        memoizedStatisticsBetweenServicesQuery);

    const memoizedExpensesByRangeQuery = useMemo(
        () => serviceLogDao.expensesByRangeStatisticsWatchedQueryCollection(memoizedStatArgs),
        [serviceLogDao, memoizedStatArgs]
    );
    const { data: expensesByRange, isLoading: isExpensesByRangeLoading } = useWatchedQueryCollection(
        memoizedExpensesByRangeQuery);

    const memoizedFrequencyByOdometerQuery = useMemo(
        () => serviceLogDao.frequencyByOdometerStatisticsWatchedQueryCollection({
            ...memoizedStatArgs,
            intervalSize: SERVICE_FREQUENCY_INTERVAL
        }),
        [serviceLogDao, SERVICE_FREQUENCY_INTERVAL, memoizedStatArgs]
    );
    const { data: frequencyByOdometer, isLoading: isFrequencyByOdometerLoading } = useWatchedQueryCollection(
        memoizedFrequencyByOdometerQuery);

    const memoizedTypeComparisonQuery = useMemo(
        () => serviceLogDao.typeComparisonStatisticsWatchedQueryCollection(memoizedStatArgs),
        [serviceLogDao, memoizedStatArgs]
    );
    const { data: typeComparison, isLoading: isTypeComparisonLoading } = useWatchedQueryCollection(
        memoizedTypeComparisonQuery);

    const memoizedItemTypeComparisonQuery = useMemo(
        () => serviceLogDao.itemTypeComparisonStatisticsWatchedQueryCollection(memoizedStatArgs),
        [serviceLogDao, memoizedStatArgs]
    );
    const { data: itemTypeComparison, isLoading: isItemTypeComparisonLoading } = useWatchedQueryCollection(
        memoizedItemTypeComparisonQuery);

    const getCountOfServices = useCallback(() => {
        const { trend, trendSymbol } = summaryByAmount?.totalTrend ?? {};

        return {
            label: t("statistics.service.log_count"),
            value: summaryByAmount?.count != null ? `${ summaryByAmount.count } ${ t("common.count") }` : null,
            isPositive: summaryByAmount?.countTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, t]);

    const getTotalServiceAmount = useCallback(() => {
        const { trend, trendSymbol } = summaryByAmount?.totalTrend ?? {};

        return {
            label: t("statistics.service.total_amount"),
            value: summaryByAmount?.total != null
                   ? formatWithUnit(summaryByAmount.total, carCurrency)
                   : null,
            isPositive: summaryByAmount?.totalTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);


    const getAverageServiceAmount = useCallback(() => {
        const { trend, trendSymbol } = summaryByAmount?.averageTrend ?? {};

        return {
            label: t("statistics.service.avg_amount"),
            value: summaryByAmount?.average != null
                   ? formatWithUnit(summaryByAmount.average, carCurrency)
                   : null,
            isPositive: summaryByAmount?.averageTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getMedianServiceAmount = useCallback(() => {
        return {
            label: t("statistics.service.median_amount"),
            value: summaryByAmount != null ? formatWithUnit(summaryByAmount.median, carCurrency) : null,
            isPositive: summaryByAmount?.medianTrend?.isTrendPositive,
            trend: summaryByAmount != null
                   ? `${ summaryByAmount.medianTrend.trendSymbol } ${ summaryByAmount.medianTrend.trend }`
                   : null,
            trendDescription: summaryByAmount ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getMaxServiceByAmount = useCallback(() => {
        return {
            label: t("statistics.service.max_amount"),
            value: summaryByAmount?.max != null
                   ? formatWithUnit(summaryByAmount.max.value, carCurrency)
                   : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getAverageDistanceBetweenServices = useCallback(() => {
        return {
            label: t("statistics.service.average_distance_between_services"),
            value: statisticsBetweenServices != null
                   ? formatWithUnit(statisticsBetweenServices.averageDistance, carOdometerUnit)
                   : null,
            isLoading: isStatisticsBetweenServicesLoading
        };
    }, [statisticsBetweenServices, isStatisticsBetweenServicesLoading, carOdometerUnit, t]);

    const getAverageTimeBetweenServices = useCallback(() => {
        return {
            label: t("statistics.service.average_time_between_services"),
            value: statisticsBetweenServices != null
                   ? statisticsBetweenServices.averageTime > 0
                     ? dayjs.duration(statisticsBetweenServices.averageTime, "days").humanize()
                     : "-"
                   : null,
            isLoading: isStatisticsBetweenServicesLoading
        };
    }, [statisticsBetweenServices, isStatisticsBetweenServicesLoading, t]);

    return (
        <View style={ styles.container }>
            <MasonryStatView
                column1={ [
                    getTotalServiceAmount()
                ] }
                column2={ [
                    getAverageServiceAmount(),
                    getMedianServiceAmount()
                ] }
            />
            <MasonryStatView
                column1={ [
                    getMaxServiceByAmount()
                ] }
                column2={ [
                    getCountOfServices()
                ] }
            />
            <StatCard { ...getAverageDistanceBetweenServices() }/>
            <StatCard { ...getAverageTimeBetweenServices() } />
            <BarChartView
                chartData={ frequencyByOdometer?.chartData }
                legend={ frequencyByOdometer?.legend }
                title={ {
                    title: t("statistics.service.frequency_distribution_by_odometer.title"),
                    description: t(
                        "statistics.service.frequency_distribution_by_odometer.description",
                        { value: formatWithUnit(SERVICE_FREQUENCY_INTERVAL, carOdometerUnit) }
                    )
                } }
                yAxisTitle={ t("statistics.service.frequency_distribution_by_odometer.y_axis") }
                formatValue={ (value) => `${ value } ${ t("common.count") }` }
                formatYAxisLabelAsValue={ false }
                formatLabel={ (label) => formatWithUnit(label, carOdometerUnit) }
                showsLegend={ false }
                isLoading={ isFrequencyByOdometerLoading }
            />
            <BarChartView
                chartData={ expensesByRange?.chartData }
                legend={ expensesByRange?.legend }
                title={ {
                    title: t("statistics.service.total_amount_by_date.title")
                } }
                yAxisTitle={ t(
                    "statistics.service.total_amount_by_date.y_axis",
                    { unit: carCurrency }
                ) }
                formatValue={ (value) => formatWithUnit(value, carCurrency) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(rangeUnit))
                }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                showsLegend={ false }
                isLoading={ isExpensesByRangeLoading }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.service.expense_distribution_by_type")
                } }
                chartData={ typeComparison?.chartData }
                legend={ typeComparison?.legend }
                formatLabel={ (label) => t(`service.types.${ label }`) }
                formatDescription={ (description) => formatWithUnit(description, carCurrency) }
                formatLegend={ (label) => t(`service.types.${ label }`) }
                legendPosition="right"
                isLoading={ isTypeComparisonLoading }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.service.expense_distribution_by_service_item")
                } }
                chartData={ itemTypeComparison?.chartData }
                legend={ itemTypeComparison?.legend }
                formatLabel={ (label) => t(`service.items.types.${ label }`) }
                formatDescription={ (description) => formatWithUnit(description, carCurrency) }
                formatLegend={ (label) => t(`service.items.types.${ label }`) }
                legendPosition="right"
                isLoading={ isItemTypeComparisonLoading }
            />
            {
                carId &&
               <ServiceForecastView carId={ carId } containerStyle={ { borderBottomWidth: 0 } }/>
            }
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));