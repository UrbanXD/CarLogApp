import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { ComparisonStatByDate, ComparisonStatByType, TotalComparisonStat } from "../../model/dao/statisticsDao.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import dayjs from "dayjs";
import { ExpenseTypeEnum } from "../../../expense/model/enums/ExpenseTypeEnum.ts";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { StyleSheet, View } from "react-native";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { StatCard } from "../StatCard.tsx";

type ServiceStatisticsProps = {
    carId?: string
    currency?: Currency
    from: string
    to: string
}

export function ServiceStatistics({ carId, currency, from, to }: ServiceStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [serviceLogsByDateWindow, setServiceLogsByDateWindow] = useState<ComparisonStatByDate | null>(null);
    const [serviceLogStat, setServiceLogStat] = useState<TotalComparisonStat | null>(null);
    const [serviceLogByType, setServiceLogByType] = useState<ComparisonStatByType | null>(null);
    const [serviceItemByType, setServiceItemByType] = useState<ComparisonStatByType | null>(null);

    useEffect(() => {
        (async () => {
            const resultServiceLogsByDateWindow = await statisticsDao.getServiceExpenseComparison({
                carId: carId,
                from,
                to
            });
            const resultServiceLogStat = await statisticsDao.getExpenseTotalComparison({
                carId: carId,
                from,
                to,
                expenseType: ExpenseTypeEnum.SERVICE
            });
            const resultServiceLogByType = await statisticsDao.getServiceComparisonByType({
                carId: carId,
                from,
                to
            });
            const resultServiceItemByType = await statisticsDao.getServiceItemComparisonByType({
                carId: carId,
                from,
                to
            });

            setServiceLogsByDateWindow(resultServiceLogsByDateWindow);
            setServiceLogStat(resultServiceLogStat);
            setServiceLogByType(resultServiceLogByType);
            setServiceItemByType(resultServiceItemByType);
        })();
    }, [carId, from, to]);

    return (
        <>
            {
                serviceLogsByDateWindow &&
               <BarChartView
                  chartData={ serviceLogsByDateWindow.barChartData }
                  legend={ serviceLogsByDateWindow.barChartTypes }
                  formatValue={ (value) => `${ value } ${ currency?.symbol }` }
                  formatLabel={ (label) => dayjs(label)
                  .format(getDateFormatTemplateByRangeUnit(serviceLogsByDateWindow?.rangeUnit)) }
                  formatLegend={ (label) => t(`expenses.types.${ label }`) }
                  showsLegend={ false }
               />
            }
            <View style={ styles.mainStatContainer }>
                <View style={ styles.infoStatContainer }>
                    {
                        serviceLogStat &&
                       <>
                          <StatCard
                             label={ t("statistics.service.total_amount") }
                             value={ `${ serviceLogStat.total } ${ currency?.symbol }` }
                             isPositive={ serviceLogStat.totalTrend.isTrendPositive }
                             trend={ `${ serviceLogStat.totalTrend.trendSymbol } ${ serviceLogStat.totalTrend.trend }` }
                             trendDescription={ t("statistics.compared_to_previous_cycle") }
                          />
                          <StatCard
                             label={ t("statistics.service.avg_amount") }
                             value={ `${ serviceLogStat.average } ${ currency?.symbol }` }
                             isPositive={ serviceLogStat.averageTrend.isTrendPositive }
                             trend={ `${ serviceLogStat.averageTrend.trendSymbol } ${ serviceLogStat.averageTrend.trend }` }
                             trendDescription={ t("statistics.compared_to_previous_cycle") }
                          />
                          <StatCard
                             label={ t("statistics.service.max_amount") }
                             value={ `${ serviceLogStat.max.value } ${ currency?.symbol }` }
                          />
                       </>
                    }
                </View>
                <View style={ { flex: 1, alignItems: "center", justifyContent: "center" } }>
                    {
                        serviceLogByType &&
                       <DonutChartView
                          title={ {
                              title: t("statistics.service.distribution_by_type"),
                              titleStyle: { textAlign: "center" }
                          } }
                          chartData={ serviceLogByType.donutChartData }
                          legend={ serviceLogByType.legend }
                          formatLabel={ (label) => t(`service.types.${ label }`) }
                          formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                          formatLegend={ (label) => t(`service.types.${ label }`) }
                       />
                    }
                </View>
            </View>
            <View style={ { flex: 1, alignItems: "center", justifyContent: "center" } }>
                {
                    serviceItemByType &&
                   <DonutChartView
                      title={ {
                          title: t("statistics.service.distribution_by_service_item"),
                          titleStyle: { textAlign: "center" }
                      } }
                      chartData={ serviceItemByType.donutChartData }
                      legend={ serviceItemByType.legend }
                      formatLabel={ (label) => t(`service.items.types.${ label }`) }
                      formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                      formatLegend={ (label) => t(`service.items.types.${ label }`) }
                   />
                }
            </View>
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