import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useEffect, useState } from "react";
import { ComparisonStatByDate, ComparisonStatByType, SummaryStat } from "../../model/dao/statisticsDao.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import dayjs from "dayjs";
import { ExpenseTypeEnum } from "../../../expense/model/enums/ExpenseTypeEnum.ts";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatTrend } from "../../utils/formatTrend.ts";

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
    const [serviceLogStat, setServiceLogStat] = useState<SummaryStat | null>(null);
    const [serviceLogByType, setServiceLogByType] = useState<ComparisonStatByType | null>(null);
    const [serviceItemByType, setServiceItemByType] = useState<ComparisonStatByType | null>(null);

    useEffect(() => {
        (async () => {
            const statArgs = {
                carId: carId,
                from,
                to
            };

            const [
                resultServiceLogsByDateWindow,
                resultServiceLogStat,
                resultServiceLogByType,
                resultServiceItemByType
            ] = await Promise.all([
                statisticsDao.getServiceExpenseComparison(statArgs),
                statisticsDao.getExpenseSummary({ ...statArgs, expenseType: ExpenseTypeEnum.SERVICE }),
                statisticsDao.getServiceComparisonByType(statArgs),
                statisticsDao.getServiceItemComparisonByType(statArgs)
            ]);

            setServiceLogsByDateWindow(resultServiceLogsByDateWindow);
            setServiceLogStat(resultServiceLogStat);
            setServiceLogByType(resultServiceLogByType);
            setServiceItemByType(resultServiceItemByType);
        })();
    }, [carId, from, to]);

    const getServiceCount = useCallback(() => {
        const { trend, trendSymbol } = serviceLogStat?.totalTrend ?? {};

        return {
            label: t("statistics.service.log_count"),
            value: serviceLogStat?.count != null ? `${ serviceLogStat.count } ${ t("common.count") }` : null,
            isPositive: serviceLogStat?.countTrend.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, t]);

    const getServiceTotal = useCallback(() => {
        const { trend, trendSymbol } = serviceLogStat?.totalTrend ?? {};

        return {
            label: t("statistics.service.total_amount"),
            value: serviceLogStat?.total != null ? `${ serviceLogStat?.total } ${ currency?.symbol }` : null,
            isPositive: serviceLogStat?.totalTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, currency, t]);


    const getServiceAverage = useCallback(() => {
        const { trend, trendSymbol } = serviceLogStat?.averageTrend ?? {};

        return {
            label: t("statistics.service.avg_amount"),
            value: serviceLogStat?.average != null ? `${ serviceLogStat.average } ${ currency?.symbol }` : null,
            isPositive: serviceLogStat?.averageTrend.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, currency, t]);


    const getServiceMax = useCallback(() => {
        return {
            label: t("statistics.service.max_amount"),
            value: serviceLogStat?.max != null ? `${ serviceLogStat.max.value } ${ currency?.symbol }` : null,
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, currency, t]);

    return (
        <>
            <MasonryStatView
                column1={ [
                    getServiceTotal(),
                    getServiceAverage()
                ] }
                column2={ [
                    getServiceMax(),
                    getServiceCount()
                ] }
            />
            <BarChartView
                chartData={ serviceLogsByDateWindow?.barChartData }
                legend={ serviceLogsByDateWindow?.barChartTypes }
                title={ {
                    title: t("statistics.service.total_amount_by_date")
                } }
                formatValue={ (value) => `${ value } ${ currency?.symbol }` }
                formatLabel={ (label) => dayjs(label)
                .format(getDateFormatTemplateByRangeUnit(serviceLogsByDateWindow?.rangeUnit)) }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                showsLegend={ false }
                isLoading={ !serviceLogsByDateWindow }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.service.distribution_by_type")
                } }
                chartData={ serviceLogByType?.donutChartData }
                legend={ serviceLogByType?.legend }
                formatLabel={ (label) => t(`service.types.${ label }`) }
                formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                formatLegend={ (label) => t(`service.types.${ label }`) }
                legendPosition="right"
                isLoading={ !serviceLogByType }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.service.distribution_by_service_item")
                } }
                chartData={ serviceItemByType?.donutChartData }
                legend={ serviceItemByType?.legend }
                formatLabel={ (label) => t(`service.items.types.${ label }`) }
                formatDescription={ (description) => `${ description } ${ currency?.symbol }` }
                formatLegend={ (label) => t(`service.items.types.${ label }`) }
                legendPosition="right"
                isLoading={ !serviceItemByType }
            />
        </>
    );
}