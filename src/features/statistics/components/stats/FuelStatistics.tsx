import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useEffect, useState } from "react";
import { ComparisonStatByDate, SummaryStat, TrendStat } from "../../model/dao/statisticsDao.ts";
import { LineChartView } from "../charts/LineChartView.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { StatCard } from "../StatCard.tsx";
import { ChartTitle } from "../charts/common/ChartTitle.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { BarChartView } from "../charts/BarChartView.tsx";

type FuelConsumptionStatisticsProps = {
    carId?: string
    from: string
    to: string
}

export function FuelStatistics({
    carId,
    from,
    to
}: FuelConsumptionStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [fuelConsumption, setFuelConsumption] = useState<TrendStat | null>(null);
    const [fuelLogSummary, setFuelLogSummary] = useState<{ quantity: SummaryStat, amount: SummaryStat } | null>(null);
    const [fuelComparisonByDateWindow, setFuelComparisonByDateWindow] = useState<ComparisonStatByDate | null>(null);
    const [fuelCostPerDistance, setFuelCostPerDistance] = useState<TrendStat | null>(null);

    useEffect(() => {
        (async () => {
            const statArgs = {
                carId: carId,
                from,
                to
            };

            const [
                resultFuelLogSummary,
                resultFuelConsumption,
                resultFuelComparisonByDateWindow,
                resultFuelCostPerDistance
            ] = await Promise.all([
                statisticsDao.getFuelSummary(statArgs),
                statisticsDao.getFuelConsumption(statArgs),
                statisticsDao.getFuelExpenseComparisonByDateWindow(statArgs),
                statisticsDao.getFuelCostPerDistance(statArgs)
            ]);

            setFuelLogSummary(resultFuelLogSummary);
            setFuelConsumption(resultFuelConsumption);
            setFuelComparisonByDateWindow(resultFuelComparisonByDateWindow);
            setFuelCostPerDistance(resultFuelCostPerDistance);
        })();
    }, [carId, from, to]);

    const getFuelCount = useCallback(() => {
        return {
            label: t("statistics.fuel.log_count"),
            value: fuelLogSummary != null ? `${ fuelLogSummary.quantity.count } ${ t("common.count") }` : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelTotalQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.total_quantity"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.quantity.total, fuelLogSummary.quantity?.unitText)
                   : null,
            isPositive: fuelLogSummary?.quantity?.totalTrend?.isTrendPositive,
            trend: fuelLogSummary != null && fuelLogSummary?.quantity
                   ? `${ fuelLogSummary.quantity.totalTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.quantity.totalTrend.trend,
                    fuelLogSummary.quantity?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelAverageQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.avg_quantity"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.quantity.average, fuelLogSummary.quantity?.unitText)
                   : null,
            isPositive: fuelLogSummary?.quantity?.averageTrend?.isTrendPositive,
            trend: fuelLogSummary != null
                   ? `${ fuelLogSummary.quantity.averageTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.quantity.averageTrend.trend,
                    fuelLogSummary.quantity?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelMedianQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.median_quantity"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.quantity.median, fuelLogSummary.quantity?.unitText)
                   : null,
            isPositive: fuelLogSummary?.quantity?.medianTrend?.isTrendPositive,
            trend: fuelLogSummary != null
                   ? `${ fuelLogSummary.quantity.medianTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.quantity.medianTrend.trend,
                    fuelLogSummary.quantity?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelMaxQuantity = useCallback(() => {
        return {
            label: t("statistics.fuel.max_quantity"),
            value: fuelLogSummary?.quantity?.max ? formatWithUnit(
                fuelLogSummary.quantity.max.value,
                fuelLogSummary.quantity?.unitText
            ) : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelTotalAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.total_amount"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.amount.total, fuelLogSummary.amount?.unitText)
                   : null,
            isPositive: fuelLogSummary?.amount?.totalTrend?.isTrendPositive,
            trend: fuelLogSummary != null
                   ? `${ fuelLogSummary.amount.totalTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.amount.totalTrend.trend,
                    fuelLogSummary.amount?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelAverageAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.avg_amount"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.amount.average, fuelLogSummary.amount?.unitText)
                   : null,
            isPositive: fuelLogSummary?.amount?.averageTrend?.isTrendPositive,
            trend: fuelLogSummary != null
                   ? `${ fuelLogSummary.amount.averageTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.amount.averageTrend.trend,
                    fuelLogSummary.amount?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelMedianAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.median_amount"),
            value: fuelLogSummary != null
                   ? formatWithUnit(fuelLogSummary.amount.median, fuelLogSummary.amount?.unitText)
                   : null,
            isPositive: fuelLogSummary?.amount?.medianTrend?.isTrendPositive,
            trend: fuelLogSummary != null
                   ? `${ fuelLogSummary.amount.medianTrend.trendSymbol } ${ formatWithUnit(
                    fuelLogSummary.amount.medianTrend.trend,
                    fuelLogSummary.amount?.unitText
                ) }`
                   : null,
            trendDescription: fuelLogSummary != null ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

    const getFuelMaxAmount = useCallback(() => {
        return {
            label: t("statistics.fuel.max_amount"),
            value: fuelLogSummary?.amount?.max ? formatWithUnit(
                fuelLogSummary.amount.max.value,
                fuelLogSummary.amount?.unitText
            ) : null,
            isLoading: !fuelLogSummary
        };
    }, [fuelLogSummary, t]);

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
                chartData={ fuelComparisonByDateWindow?.barChartData }
                legend={ fuelComparisonByDateWindow?.legend }
                title={ {
                    title: t("statistics.fuel.total_amount_by_date.title")
                } }
                yAxisTitle={ t(
                    "statistics.fuel.total_amount_by_date.y_axis",
                    { unit: fuelComparisonByDateWindow?.unitText }
                ) }
                formatValue={ (value) => formatWithUnit(value, fuelComparisonByDateWindow?.unitText) }
                formatLabel={ (label) => dayjs(label)
                .format(getDateFormatTemplateByRangeUnit(fuelComparisonByDateWindow?.rangeUnit)) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                showsLegend={ false }
                isLoading={ !fuelComparisonByDateWindow }
            />
            <LineChartView
                title={ {
                    title: t("statistics.fuel.consumption.title"),
                    description: fuelConsumption && fuelConsumption.lineChartData.length > 0 && t(
                        "statistics.fuel.accuracy")
                } }
                yAxisTitle={ t("statistics.fuel.consumption.y_axis", { unit: fuelConsumption?.unitText }) }
                chartData={ fuelConsumption?.lineChartData }
                formatValue={ (value) => formatWithUnit(value, fuelConsumption?.unitText) }
                formatLabel={ (label) => dayjs(label).format("L") }
                isLoading={ !fuelConsumption }
            />
            <LineChartView
                title={ {
                    title: t("statistics.fuel.cost_per_distance.title"),
                    description: fuelCostPerDistance && fuelCostPerDistance.lineChartData.length > 0 && t(
                        "statistics.fuel.accuracy")
                } }
                yAxisTitle={ t("statistics.fuel.cost_per_distance.y_axis", { unit: fuelCostPerDistance?.unitText }) }
                chartData={ fuelCostPerDistance?.lineChartData }
                formatValue={ (value) => formatWithUnit(value, fuelCostPerDistance?.unitText) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(fuelCostPerDistance?.rangeUnit))
                }
                isLoading={ !fuelCostPerDistance }
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