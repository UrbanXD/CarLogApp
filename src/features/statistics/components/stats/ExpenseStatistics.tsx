import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { ComparisonStatByDate, ComparisonStatByType, StatisticsFunctionArgs } from "../../model/dao/statisticsDao.ts";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants";
import { useTranslation } from "react-i18next";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { formatTrend } from "../../utils/formatTrend.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";

type ExpenseStatisticsProps = {
    carId?: string | null
    from: string
    to: string
}

export function ExpenseStatistics({ carId, from, to }: ExpenseStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao, expenseDao } = useDatabase();

    const memoizedStatArgs: StatisticsFunctionArgs = useMemo(() => ({
        carId: carId,
        from,
        to
    }), [carId, from, to]);

    const memoizedQuery = useMemo(
        () => expenseDao.summaryStatisticsWatchedQueryItem(memoizedStatArgs),
        [expenseDao, memoizedStatArgs]
    );
    const { data: summary, isLoading } = useWatchedQueryItem(memoizedQuery);

    const [expensesByDateWindow, setExpensesByDateWindow] = useState<ComparisonStatByDate | null>(null);
    const [expensesByType, setExpensesByType] = useState<ComparisonStatByType | null>(null);

    useEffect(() => {
        (async () => {
            const statArgs = {
                carId: carId,
                from,
                to
            };

            const [
                resultExpensesByDateWindow,
                resultExpensesByType
            ] = await Promise.all([
                statisticsDao.getExpenseComparison(statArgs),
                statisticsDao.getExpenseComparisonByType(statArgs)
            ]);

            setExpensesByDateWindow(resultExpensesByDateWindow);
            setExpensesByType(resultExpensesByType);
        })();
    }, [carId, from, to]);

    const getCountOfExpenses = useCallback(() => {
        const { trend, trendSymbol } = summary?.totalTrend ?? {};

        return {
            label: t("statistics.expense.count"),
            value: summary?.count != null ? `${ summary.count } ${ t("common.count") }` : null,
            isPositive: summary?.countTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: isLoading
        };
    }, [summary, t]);

    const getTotalExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.total_amount"),
            value: summary ? formatWithUnit(summary.total, summary?.unitText) : null,
            isPositive: summary?.totalTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.totalTrend.trendSymbol } ${ summary.totalTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isLoading
        };
    }, [summary, t]);


    const getAverageExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.avg_amount"),
            value: summary ? formatWithUnit(summary.average, summary?.unitText) : null,
            isPositive: summary?.averageTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.averageTrend.trendSymbol } ${ summary.averageTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isLoading
        };
    }, [summary, t]);


    const getMedianExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.median_amount"),
            value: summary ? formatWithUnit(summary.median, summary?.unitText) : null,
            isPositive: summary?.medianTrend.isTrendPositive,
            trend: summary
                   ? `${ summary.medianTrend.trendSymbol } ${ summary.medianTrend.trend }`
                   : null,
            trendDescription: summary ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: isLoading
        };
    }, [summary, t]);

    const getMaxExpense = useCallback(() => {
        return {
            label: t("statistics.expense.max_amount"),
            value: summary?.max?.value != null ? formatWithUnit(summary.max.value, summary?.unitText) : null,
            description: summary?.max?.label != null ? t(`expenses.types.${ summary.max.label }`) : null,
            descriptionStyle: summary?.max?.color != null ? { color: summary.max.color } : undefined,
            isLoading: isLoading
        };
    }, [summary, t]);

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
                chartData={ expensesByDateWindow?.barChartData }
                legend={ expensesByDateWindow?.legend }
                yAxisTitle={ t(
                    "statistics.expense.total_amount_by_date.y_axis",
                    { unit: expensesByDateWindow?.unitText }
                ) }
                formatValue={ (value) => formatWithUnit(value, expensesByDateWindow?.unitText) }
                formatLabel={ (label) => dayjs(label)
                .format(getDateFormatTemplateByRangeUnit(expensesByDateWindow?.rangeUnit)) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                isLoading={ !expensesByDateWindow }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.expense.distribution_by_type")
                } }
                chartData={ expensesByType?.donutChartData }
                legend={ expensesByType?.legend }
                formatLabel={ (label) => t(`expenses.types.${ label }`) }
                formatDescription={ (description) => formatWithUnit(description, expensesByType?.unitText) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                legendPosition="right"
                isLoading={ !expensesByType }
            />
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));