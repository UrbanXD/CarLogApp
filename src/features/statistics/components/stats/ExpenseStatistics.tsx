import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { ComparisonStatByDate, ComparisonStatByType, SummaryStat } from "../../model/dao/statisticsDao.ts";
import { StyleSheet } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { useTranslation } from "react-i18next";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { formatTrend } from "../../utils/formatTrend.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";

type ExpenseStatisticsProps = {
    carId?: string
    currency?: Currency
    from: string
    to: string
}

export function ExpenseStatistics({ carId, currency, from, to }: ExpenseStatisticsProps) {
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
            value: expenseStat ? `${ expenseStat.total } ${ currency?.symbol }` : null,
            isPositive: expenseStat?.totalTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.totalTrend.trendSymbol } ${ expenseStat.totalTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, currency, t]);


    const getAverageExpenseAmount = useCallback(() => {
        return {
            label: t("statistics.expense.avg_amount"),
            value: expenseStat ? `${ expenseStat.average } ${ currency?.symbol }` : null,
            isPositive: expenseStat?.averageTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.averageTrend.trendSymbol } ${ expenseStat.averageTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, currency, t]);


    const getMedianExpenseAmount = useCallback(() => {
        console.log(expenseStat?.median);
        return {
            label: t("statistics.expense.median_amount"),
            value: expenseStat ? `${ expenseStat.median } ${ currency?.symbol }` : null,
            isPositive: expenseStat?.medianTrend.isTrendPositive,
            trend: expenseStat
                   ? `${ expenseStat.medianTrend.trendSymbol } ${ expenseStat.medianTrend.trend }`
                   : null,
            trendDescription: expenseStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !expenseStat
        };
    }, [expenseStat, currency, t]);

    const getMaxExpense = useCallback(() => {
        return {
            label: t("statistics.expense.max_amount"),
            value: expenseStat?.max != null ? `${ expenseStat.max.value } ${ currency?.symbol }` : null,
            description: expenseStat ? t(`expenses.types.${ expenseStat.max.label }`) : null,
            descriptionStyle: expenseStat ? { color: expenseStat.max.color } : undefined,
            isLoading: !expenseStat
        };
    }, [expenseStat, currency, t]);


    return (
        <>
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
                    title: t("statistics.expense.total_amount_by_date")
                } }
                chartData={ expensesByDateWindow?.barChartData }
                legend={ expensesByDateWindow?.barChartTypes }
                formatValue={ (value) => `${ value } ${ currency?.symbol }` }
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
                formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                legendPosition="right"
                isLoading={ !expensesByType }
            />
        </>
    );
}

const styles = StyleSheet.create(({
    mainStatContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    infoStatContainer: {
        flex: 0.85,
        flexDirection: "column",
        gap: SEPARATOR_SIZES.lightSmall
    }
}));