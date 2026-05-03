import React, { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { formatTrend } from "../../utils/formatTrend.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { useWatchedQueryCollection } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { useCar } from "../../../car/hooks/useCar.ts";
import { getRangeUnit } from "../../utils/getRangeUnit.ts";
import { StatisticsFunctionArgs } from "../../../../database/dao/types/statistics.ts";

type ExpenseStatisticsProps = {
    carId?: string | null
    from: string | null
    to: string | null
}

export function ExpenseStatistics({ carId, from, to }: ExpenseStatisticsProps) {
    const { t } = useTranslation();
    const { expenseDao } = useDatabase();

    const { car } = useCar({ carId });

    const memoizedStatArgs: StatisticsFunctionArgs = useMemo(() => ({
        carId: carId,
        from,
        to
    }), [carId, from, to]);

    const memoizedSummaryQuery = useMemo(
        () => expenseDao.summaryStatisticsWatchedQueryItem(memoizedStatArgs),
        [expenseDao, memoizedStatArgs]
    );
    const { data: summary, isLoading: isSummaryLoading } = useWatchedQueryItem(memoizedSummaryQuery);

    const memoizedTypeComparisonQuery = useMemo(
        () => expenseDao.typeComparisonStatisticsWatchedQueryCollection(memoizedStatArgs),
        [expenseDao, memoizedStatArgs]
    );
    const { data: typeComparison, isLoading: isTypeComparisonLoading } = useWatchedQueryCollection(
        memoizedTypeComparisonQuery);

    const memoizedGroupedExpensesByRangeQuery = useMemo(
        () => expenseDao.groupedExpensesByRangeStatisticsWatchedQueryCollection(memoizedStatArgs),
        [expenseDao, memoizedStatArgs]
    );
    const { data: groupedExpensesByRange, isLoading: isGroupedExpensesByRangeLoading } = useWatchedQueryCollection(
        memoizedGroupedExpensesByRangeQuery);

    const getCountOfExpenses = useCallback(() => {
        const { trend, trendSymbol } = summary?.totalTrend ?? {};

        return {
            label: t("statistics.expense.count"),
            value: summary?.count != null ? `${ summary.count } ${ t("common.count") }` : null,
            isPositive: summary?.countTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isSummaryLoading
        };
    }, [summary, isSummaryLoading, t]);

    const getTotalExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.total_amount"),
            value: summary ? formatWithUnit(summary.total, car?.currency.symbol) : null,
            isPositive: summary?.totalTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.totalTrend.trendSymbol } ${ summary.totalTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryLoading
        };
    }, [summary, isSummaryLoading, car?.currency, t]);


    const getAverageExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.avg_amount"),
            value: summary ? formatWithUnit(summary.average, car?.currency.symbol) : null,
            isPositive: summary?.averageTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.averageTrend.trendSymbol } ${ summary.averageTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryLoading
        };
    }, [summary, isSummaryLoading, car?.currency, t]);


    const getMedianExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.median_amount"),
            value: summary ? formatWithUnit(summary.median, car?.currency.symbol) : null,
            isPositive: summary?.medianTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.medianTrend.trendSymbol } ${ summary.medianTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isSummaryLoading
        };
    }, [summary, isSummaryLoading, car?.currency, t]);

    const getMaxExpense = useCallback(() => {
        return {
            label: t("statistics.expense.max_amount"),
            value: summary?.max?.value != null ? formatWithUnit(summary.max.value, car?.currency.symbol) : null,
            description: summary?.max?.label != null ? t(`expenses.types.${ summary.max.label }`) : null,
            descriptionStyle: summary?.max?.color != null ? { color: summary.max.color } : undefined,
            isLoading: isSummaryLoading
        };
    }, [summary, isSummaryLoading, car?.currency.symbol, t]);

    return (
        <View style={ styles.container }>
            <MasonryStatView
                column1={ [
                    getTotalExpenseAmount()
                ] }
                column2={ [
                    getAverageExpenseAmount(),
                    getMedianExpenseAmount()
                ] }
            />
            <MasonryStatView
                column1={ [
                    getMaxExpense()
                ] }
                column2={ [
                    getCountOfExpenses()
                ] }
            />
            <BarChartView
                title={ {
                    title: t("statistics.expense.total_amount_by_date.title")
                } }
                chartData={ groupedExpensesByRange?.chartData }
                legend={ groupedExpensesByRange?.legend }
                yAxisTitle={ t(
                    "statistics.expense.total_amount_by_date.y_axis",
                    { unit: car?.currency.symbol }
                ) }
                formatValue={ (value) => formatWithUnit(value, car?.currency.symbol) }
                formatLabel={ (label) => dayjs(label)
                .format(getDateFormatTemplateByRangeUnit(getRangeUnit(from, to))) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                isLoading={ isGroupedExpensesByRangeLoading }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.expense.distribution_by_type")
                } }
                chartData={ typeComparison?.chartData }
                legend={ typeComparison?.legend }
                formatLabel={ (label) => t(`expenses.types.${ label }`) }
                formatDescription={ (description) => formatWithUnit(description, car?.currency.symbol) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                legendPosition="right"
                isLoading={ isTypeComparisonLoading }
            />
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));