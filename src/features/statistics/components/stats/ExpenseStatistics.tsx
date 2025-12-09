import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { ComparisonStatByDate, ComparisonStatByType, SummaryStat } from "../../model/dao/statisticsDao.ts";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { useTranslation } from "react-i18next";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { formatTrend } from "../../utils/formatTrend.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";

type ExpenseStatisticsProps = {
    carId?: string
    from: string
    to: string
}

export function ExpenseStatistics({ carId, from, to }: ExpenseStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [expensesByDateWindow, setExpensesByDateWindow] = useState<ComparisonStatByDate | null>(null);
    const [expenseStat, setExpenseStat] = useState<SummaryStat | null>(null);
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
                resultExpenseStat,
                resultExpensesByType
            ] = await Promise.all([
                statisticsDao.getExpenseComparison(statArgs),
                statisticsDao.getExpenseSummary(statArgs),
                statisticsDao.getExpenseComparisonByType(statArgs)
            ]);

            setExpensesByDateWindow(resultExpensesByDateWindow);
            setExpenseStat(resultExpenseStat);
            setExpensesByType(resultExpensesByType);
        })();
    }, [carId, from, to]);

    const getCountOfExpenses = useCallback(() => {
        const { trend, trendSymbol } = expenseStat?.totalTrend ?? {};

        return {
            label: t("statistics.expense.count"),
            value: expenseStat?.count != null ? `${ expenseStat.count } ${ t("common.count") }` : null,
            isPositive: expenseStat?.countTrend.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !expenseStat
        };
    }, [expenseStat, t]);

    const getTotalExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.total_amount"),
            value: expenseStat ? formatWithUnit(expenseStat.total, expenseStat?.unitText) : null,
            isPositive: expenseStat?.totalTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.totalTrend.trendSymbol } ${ expenseStat.totalTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, t]);


    const getAverageExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.avg_amount"),
            value: expenseStat ? formatWithUnit(expenseStat.average, expenseStat?.unitText) : null,
            isPositive: expenseStat?.averageTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.averageTrend.trendSymbol } ${ expenseStat.averageTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, t]);


    const getMedianExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.median_amount"),
            value: expenseStat ? formatWithUnit(expenseStat.median, expenseStat?.unitText) : null,
            isPositive: expenseStat?.medianTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.medianTrend.trendSymbol } ${ expenseStat.medianTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, t]);

    const getMaxExpense = useCallback(() => {
        return {
            label: t("statistics.expense.max_amount"),
            value: expenseStat?.max != null ? formatWithUnit(expenseStat.max.value, expenseStat?.unitText) : null,
            description: expenseStat ? t(`expenses.types.${ expenseStat.max.label }`) : null,
            descriptionStyle: expenseStat ? { color: expenseStat.max.color } : undefined,
            isLoading: !expenseStat
        };
    }, [expenseStat, t]);

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