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
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";

type ServiceStatisticsProps = {
    carId?: string
    from: string
    to: string
}

export function ServiceStatistics({ carId, from, to }: ServiceStatisticsProps) {
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

    const getCountOfServices = useCallback(() => {
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

    const getTotalServiceAmount = useCallback(() => {
        const { trend, trendSymbol } = serviceLogStat?.totalTrend ?? {};

        return {
            label: t("statistics.service.total_amount"),
            value: serviceLogStat?.total != null
                   ? formatWithUnit(serviceLogStat.total, serviceLogStat?.unitText)
                   : null,
            isPositive: serviceLogStat?.totalTrend?.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, t]);


    const getAverageServiceAmount = useCallback(() => {
        const { trend, trendSymbol } = serviceLogStat?.averageTrend ?? {};

        return {
            label: t("statistics.service.avg_amount"),
            value: serviceLogStat?.average != null
                   ? formatWithUnit(serviceLogStat.average, serviceLogStat?.unitText)
                   : null,
            isPositive: serviceLogStat?.averageTrend.isTrendPositive,
            trend: formatTrend({ trend: trend, trendSymbol: trendSymbol }),
            trendDescription: t("statistics.compared_to_previous_cycle"),
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, t]);

    const getMedianServiceAmount = useCallback(() => {
        return {
            label: t("statistics.service.median_amount"),
            value: serviceLogStat ? formatWithUnit(serviceLogStat.median, serviceLogStat?.unitText) : null,
            isPositive: serviceLogStat?.medianTrend.isTrendPositive,
            trend: serviceLogStat
                   ? `${ serviceLogStat.medianTrend.trendSymbol } ${ serviceLogStat.medianTrend.trend }`
                   : null,
            trendDescription: serviceLogStat ? t("statistics.compared_to_previous_cycle") : null,
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, t]);

    const getMaxServiceByAmount = useCallback(() => {
        return {
            label: t("statistics.service.max_amount"),
            value: serviceLogStat?.max != null
                   ? formatWithUnit(serviceLogStat.max.value, serviceLogStat?.unitText)
                   : null,
            isLoading: !serviceLogStat
        };
    }, [serviceLogStat, t]);

    return (
        <>
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
            <BarChartView
                chartData={ serviceLogsByDateWindow?.barChartData }
                legend={ serviceLogsByDateWindow?.barChartTypes }
                title={ {
                    title: t("statistics.service.total_amount_by_date")
                } }
                formatValue={ (value) => formatWithUnit(value, serviceLogsByDateWindow?.unitText) }
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
                formatDescription={ (description) => formatWithUnit(description, serviceLogByType?.unitText) }
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
                formatDescription={ (description) => formatWithUnit(description, serviceItemByType?.unitText) }
                formatLegend={ (label) => t(`service.items.types.${ label }`) }
                legendPosition="right"
                isLoading={ !serviceItemByType }
            />
        </>
    );
}