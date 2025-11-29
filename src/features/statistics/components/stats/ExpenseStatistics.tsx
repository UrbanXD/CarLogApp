import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import { ComparisonStat, ComparisonStatByType, TotalComparisonStat } from "../../model/dao/statisticsDao.ts";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { StatCard } from "../StatCard.tsx";
import { useTranslation } from "react-i18next";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";

type ExpenseStatisticsProps = {
    carId?: string
    currency?: Currency
    from: string
    to: string
}

export function ExpenseStatistics({ carId, currency, from, to }: ExpenseStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [expensesByDateWindow, setExpensesByDateWindow] = useState<ComparisonStat | null>(null);
    const [expenseStat, setExpenseStat] = useState<TotalComparisonStat | null>(null);
    const [expensesByType, setExpensesByType] = useState<ComparisonStatByType | null>(null);

    useEffect(() => {
        (async () => {
            const resultExpensesByDateWindow = await statisticsDao.getExpenseComparison({ carId: carId, from, to });
            const resultExpenseStat = await statisticsDao.getExpenseTotalComparison({ carId: carId, from, to });
            const resultExpensesByType = await statisticsDao.getExpenseComparisonByType({ carId: carId, from, to });

            setExpensesByDateWindow(resultExpensesByDateWindow);
            setExpenseStat(resultExpenseStat);
            setExpensesByType(resultExpensesByType);
        })();
    }, [carId, from, to]);

    return (
        <>
            {
                expensesByDateWindow &&
               <BarChartView
                  chartData={ expensesByDateWindow.barChartData }
                  legend={ expensesByDateWindow.barChartTypes }
                  formatLabel={ (label) => dayjs(label).format("L") }
                  formatLegend={ (label) => t(`expenses.types.${ label }`) }
               />
            }
            <View style={ styles.mainStatContainer }>
                <View style={ styles.infoStatContainer }>
                    {
                        expenseStat &&
                       <>
                          <StatCard
                             label={ t("statistics.expense.total_amount") }
                             value={ `${ expenseStat.total } ${ currency?.symbol }` }
                             isPositive={ expenseStat.trend?.isTrendPositive }
                             trend={ expenseStat.trend?.trend }
                             trendDescription={
                                 `${ expenseStat.trend?.trendDescription } ${ t("statistics.compared_to_previous_cycle") }`
                             }
                          />
                          <StatCard
                             label={ t("statistics.expense.avg_amount") }
                             value={ `${ expenseStat.average } ${ currency?.symbol }` }
                          />
                          <StatCard
                             label={ t("statistics.expense.max_amount") }
                             value={ `${ expenseStat.max.value } ${ currency?.symbol }` }
                             description={ t(`expenses.types.${ expenseStat.max.label }`) }
                             descriptionStyle={ { color: expenseStat.max.color } }
                          />
                       </>
                    }
                </View>
                <View style={ { flex: 1, alignItems: "center", justifyContent: "center" } }>
                    {
                        expensesByType &&
                       <DonutChartView
                          title={ {
                              title: t("statistics.expense.distribution_by_type"),
                              titleStyle: { textAlign: "center" }
                          } }
                          chartData={ expensesByType.donutChartData }
                          formatLabel={ (label) => t(`expenses.types.${ label }`) }
                          formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                       />
                    }
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create(({
    container: {},
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