import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { LineChartView } from "../charts/LineChartView.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { StatCard } from "../StatCard.tsx";
import { ChartTitle } from "../charts/common/ChartTitle.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { useCar } from "../../../car/hooks/useCar.ts";
import { useWatchedQueryCollection } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { getRangeUnit } from "../../utils/getRangeUnit.ts";
import { StatisticsFunctionArgs } from "../../../../database/dao/types/statistics.ts";

type FuelConsumptionStatisticsProps = {
    carId?: string | null
    from: string | null
    to: string | null
}

export function FuelStatistics({
    carId,
    from,
    to
}: FuelConsumptionStatisticsProps) {
    const { t } = useTranslation();
    const { fuelLogDao } = useDatabase();

    const { car } = useCar({ carId });

    const rangeUnit = useMemo(() => getRangeUnit(from, to), [from, to]);
    const carCurrency = useMemo(() => car?.currency.symbol, [car?.currency]);
    const carFuelUnit = useMemo(() => car?.fuelTank.unit.short, [car?.fuelTank]);
    const carOdometerUnit = useMemo(() => car?.odometer.unit.short, [car?.odometer.unit]);
    const fuelConsumptionUnit = useMemo(() => (
        carFuelUnit && carOdometerUnit
        ? `${ carFuelUnit } / 100 ${ carOdometerUnit }`
        : null
    ), [carFuelUnit, carOdometerUnit]);
    const fuelCostPerDistanceUnit = useMemo(() => (
        carCurrency && carOdometerUnit
        ? `${ carCurrency } / 100 ${ carOdometerUnit }`
        : null
    ), [carCurrency, carOdometerUnit]);

    const memoizedStatArgs: StatisticsFunctionArgs = useMemo(() => ({
        carId: carId,
        from,
        to
    }), [carId, from, to]);

    const memoizedSummaryByAmountQuery = useMemo(
        () => fuelLogDao.summaryStatisticsByAmountWatchedQueryItem(memoizedStatArgs),
        [fuelLogDao, memoizedStatArgs]
    );
    const { data: summaryByAmount, isLoading: isSummaryByAmountLoading } = useWatchedQueryItem(
        memoizedSummaryByAmountQuery);

    const memoizedSummaryByQuantityQuery = useMemo(
        () => fuelLogDao.summaryStatisticsByQuantityWatchedQueryItem(memoizedStatArgs),
        [fuelLogDao, memoizedStatArgs]
    );
    const { data: summaryByQuantity, isLoading: isSummaryByQuantityLoading } = useWatchedQueryItem(
        memoizedSummaryByQuantityQuery);

    const memoizedExpensesByRangeQuery = useMemo(
        () => fuelLogDao.expensesByRangeStatisticsWatchedQueryCollection(memoizedStatArgs),
        [fuelLogDao, memoizedStatArgs]
    );
    const { data: expensesByRange, isLoading: isExpensesByRangeLoading } = useWatchedQueryCollection(
        memoizedExpensesByRangeQuery);

    const memoizedFuelConsumptionQuery = useMemo(
        () => fuelLogDao.fuelConsumptionStatisticsWatchedQueryCollection(memoizedStatArgs),
        [fuelLogDao, memoizedStatArgs]
    );
    const { data: fuelConsumption, isLoading: isFuelConsumptionLoading } = useWatchedQueryCollection(
        memoizedFuelConsumptionQuery);

    const memoizedFuelCostPerDistanceQuery = useMemo(
        () => fuelLogDao.fuelCostPerDistanceStatisticsWatchedQueryCollection(memoizedStatArgs),
        [fuelLogDao, memoizedStatArgs]
    );
    const { data: fuelCostPerDistance, isLoading: isFuelCostPerDistanceLoading } = useWatchedQueryCollection(
        memoizedFuelCostPerDistanceQuery);

    const getFuelCount = useCallback(() => {
        return {
            label: t("statistics.fuel.log_count"),
            value: summaryByQuantity != null ? `${ summaryByQuantity?.count } ${ t("common.count") }` : null,
            isPositive: summaryByQuantity?.countTrend?.isTrendPositive,
            trend: summaryByQuantity != null
                   ? `${ summaryByQuantity.countTrend?.trendSymbol } ${ summaryByQuantity.countTrend?.trend }`
                   : null,
            trendDescription: summaryByQuantity != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !summaryByQuantity
        };
    }, [summaryByQuantity, t]);

    const getFuelTotalQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.total_quantity"),
            value: summaryByQuantity != null
                   ? formatWithUnit(summaryByQuantity.total, carFuelUnit)
                   : null,
            isPositive: summaryByQuantity?.totalTrend?.isTrendPositive,
            trend: summaryByQuantity != null
                   ? `${ summaryByQuantity.totalTrend.trendSymbol } ${ formatWithUnit(
                    summaryByQuantity.totalTrend.trend,
                    carFuelUnit
                ) }`
                   : null,
            trendDescription: summaryByQuantity != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByQuantityLoading
        };
    }, [summaryByQuantity, isSummaryByQuantityLoading, carFuelUnit, t]);

    const getFuelAverageQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.avg_quantity"),
            value: summaryByQuantity != null
                   ? formatWithUnit(summaryByQuantity.average, carFuelUnit)
                   : null,
            isPositive: summaryByQuantity?.averageTrend?.isTrendPositive,
            trend: summaryByQuantity != null
                   ? `${ summaryByQuantity.averageTrend.trendSymbol } ${ formatWithUnit(
                    summaryByQuantity.averageTrend.trend,
                    carFuelUnit
                ) }`
                   : null,
            trendDescription: summaryByQuantity != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByQuantityLoading
        };
    }, [summaryByQuantity, isSummaryByQuantityLoading, carFuelUnit, t]);

    const getFuelMedianQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.median_quantity"),
            value: summaryByQuantity != null
                   ? formatWithUnit(summaryByQuantity.median, carFuelUnit)
                   : null,
            isPositive: summaryByQuantity?.medianTrend?.isTrendPositive,
            trend: summaryByQuantity != null
                   ? `${ summaryByQuantity.medianTrend.trendSymbol } ${ formatWithUnit(
                    summaryByQuantity.medianTrend.trend,
                    carFuelUnit
                ) }`
                   : null,
            trendDescription: summaryByQuantity != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByQuantityLoading
        };
    }, [summaryByQuantity, isSummaryByQuantityLoading, carFuelUnit, t]);

    const getFuelMaxQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.max_quantity"),
            value: summaryByQuantity?.max ? formatWithUnit(
                summaryByQuantity.max.value,
                carFuelUnit
            ) : null,
            isLoading: isSummaryByQuantityLoading
        };
    }, [summaryByQuantity, isSummaryByQuantityLoading, carFuelUnit, t]);

    const getFuelTotalAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.total_amount"),
            value: summaryByAmount != null
                   ? formatWithUnit(summaryByAmount.total, carCurrency)
                   : null,
            isPositive: summaryByAmount?.totalTrend?.isTrendPositive,
            trend: summaryByAmount != null
                   ? `${ summaryByAmount.totalTrend.trendSymbol } ${ formatWithUnit(
                    summaryByAmount.totalTrend.trend,
                    carCurrency
                ) }`
                   : null,
            trendDescription: summaryByAmount != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getFuelAverageAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.avg_amount"),
            value: summaryByAmount != null
                   ? formatWithUnit(summaryByAmount.average, carCurrency)
                   : null,
            isPositive: summaryByAmount?.averageTrend?.isTrendPositive,
            trend: summaryByAmount != null
                   ? `${ summaryByAmount.averageTrend.trendSymbol } ${ formatWithUnit(
                    summaryByAmount.averageTrend.trend,
                    carCurrency
                ) }`
                   : null,
            trendDescription: summaryByAmount != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getFuelMedianAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.median_amount"),
            value: summaryByAmount != null
                   ? formatWithUnit(summaryByAmount.median, carCurrency)
                   : null,
            isPositive: summaryByAmount?.medianTrend?.isTrendPositive,
            trend: summaryByAmount != null
                   ? `${ summaryByAmount?.medianTrend.trendSymbol } ${ formatWithUnit(
                    summaryByAmount.medianTrend.trend,
                    carCurrency
                ) }`
                   : null,
            trendDescription: summaryByAmount != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    const getFuelMaxAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.max_amount"),
            value: summaryByAmount?.max ? formatWithUnit(
                summaryByAmount.max.value,
                carCurrency
            ) : null,
            isLoading: isSummaryByAmountLoading
        };
    }, [summaryByAmount, isSummaryByAmountLoading, carCurrency, t]);

    return (
        <View style={ styles.container }>
            <View style={ styles.statCardContainer }>
                <StatCard { ...getFuelCount() } />
                <ChartTitle title={ t("statistics.fuel.amount") }/>
                <MasonryStatView
                    column1={ [
                        getFuelTotalAmount(),
                        getFuelMaxAmount()
                    ] }
                    column2={ [
                        getFuelAverageAmount(),
                        getFuelMedianAmount()
                    ] }
                />
                <ChartTitle title={ t("statistics.fuel.quantity") }/>
                <MasonryStatView
                    column1={ [
                        getFuelTotalQuantity(),
                        getFuelMaxQuantity()
                    ] }
                    column2={ [
                        getFuelAverageQuantity(),
                        getFuelMedianQuantity()
                    ] }
                />
            </View>
            <BarChartView
                chartData={ expensesByRange?.chartData }
                legend={ expensesByRange?.legend }
                title={ {
                    title: t("statistics.fuel.total_amount_by_date.title")
                } }
                yAxisTitle={ t(
                    "statistics.fuel.total_amount_by_date.y_axis",
                    { unit: carCurrency }
                ) }
                formatValue={ (value) => formatWithUnit(value, carCurrency) }
                formatLabel={ (label) => dayjs(label)
                .format(getDateFormatTemplateByRangeUnit(rangeUnit)) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                showsLegend={ false }
                isLoading={ isExpensesByRangeLoading }
            />
            <LineChartView
                title={ {
                    title: t("statistics.fuel.consumption.title"),
                    description: fuelConsumption && fuelConsumption.chartData.length > 0
                                 ? t("statistics.fuel.accuracy")
                                 : undefined
                } }
                yAxisTitle={ t("statistics.fuel.consumption.y_axis", { unit: fuelConsumptionUnit }) }
                chartData={ fuelConsumption?.chartData }
                formatValue={ (value) => formatWithUnit(value, fuelConsumptionUnit) }
                formatLabel={ (label) => dayjs(label).format("L") }
                isLoading={ isFuelConsumptionLoading }
            />
            <LineChartView
                title={ {
                    title: t("statistics.fuel.cost_per_distance.title"),
                    description: fuelCostPerDistance && fuelCostPerDistance.chartData.length > 0
                                 ? t("statistics.fuel.accuracy")
                                 : undefined
                } }
                yAxisTitle={ t("statistics.fuel.cost_per_distance.y_axis", { unit: fuelCostPerDistanceUnit }) }
                chartData={ fuelCostPerDistance?.chartData }
                formatValue={ (value) => formatWithUnit(value, fuelCostPerDistanceUnit) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit("day"))
                }
                isLoading={ isFuelCostPerDistanceLoading }
            />
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    },
    statCardContainer: {
        gap: SEPARATOR_SIZES.small
    }
}));