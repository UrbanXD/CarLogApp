import { useTranslation } from "react-i18next";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useEffect, useState } from "react";
import { ComparisonStatByDate, ComparisonStatByType, Stat, SummaryStat } from "../../model/dao/statisticsDao.ts";
import { BarChartView } from "../charts/BarChartView.tsx";
import dayjs from "dayjs";
import { ExpenseTypeEnum } from "../../../expense/model/enums/ExpenseTypeEnum.ts";
import { DonutChartView } from "../charts/DonutChartView.tsx";
import { getDateFormatTemplateByRangeUnit } from "../../utils/getDateFormatTemplateByRangeUnit.ts";
import { MasonryStatView } from "../MasonryStatView.tsx";
import { formatTrend } from "../../utils/formatTrend.ts";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";
import { StatCard } from "../StatCard.tsx";
import { ServiceForecastView } from "../forecasts/ServiceForecastView.tsx";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";

const SERVICE_FREQUENCY_INTERVAL = 25000;

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
    const [averageDistanceBetweenServices, setAverageDistanceBetweenServices] = useState<{
        averageDistance: Omit<Stat, "label" | "color">,
        averageTime: Omit<Stat, "label" | "color">
    } | null>(null);
    const [serviceFrequencyByOdometer, setServiceFrequencyByOdometer] = useState<ComparisonStatByDate | null>(null);

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
                resultServiceItemByType,
                resultAverageDistanceBetweenServices,
                resultServiceFrequencyByOdometer
            ] = await Promise.all([
                statisticsDao.getServiceExpenseComparison(statArgs),
                statisticsDao.getExpenseSummary({ ...statArgs, expenseType: ExpenseTypeEnum.SERVICE }),
                statisticsDao.getServiceComparisonByType(statArgs),
                statisticsDao.getServiceItemComparisonByType(statArgs),
                statisticsDao.getStatBetweenServices(statArgs),
                statisticsDao.getServiceFrequencyByOdometer({ ...statArgs, intervalSize: SERVICE_FREQUENCY_INTERVAL })
            ]);

            setServiceLogsByDateWindow(resultServiceLogsByDateWindow);
            setServiceLogStat(resultServiceLogStat);
            setServiceLogByType(resultServiceLogByType);
            setServiceItemByType(resultServiceItemByType);
            setAverageDistanceBetweenServices(resultAverageDistanceBetweenServices);
            setServiceFrequencyByOdometer(resultServiceFrequencyByOdometer);
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

    const getAverageDistanceBetweenServices = useCallback(() => {
        return {
            label: t("statistics.service.average_distance_between_services"),
            value: averageDistanceBetweenServices != null
                   ? formatWithUnit(
                    averageDistanceBetweenServices.averageDistance.value,
                    averageDistanceBetweenServices.averageDistance?.unitText
                )
                   : null,
            isLoading: !averageDistanceBetweenServices
        };
    }, [averageDistanceBetweenServices, t]);

    const getAverageTimeBetweenServices = useCallback(() => {
        return {
            label: t("statistics.service.average_time_between_services"),
            value: averageDistanceBetweenServices != null
                   ? averageDistanceBetweenServices.averageTime.value > 0 ? dayjs.duration(
                    averageDistanceBetweenServices.averageTime.value,
                    "days"
                ).humanize() : "-"
                   : null,
            isLoading: !averageDistanceBetweenServices
        };
    }, [averageDistanceBetweenServices, t]);

    return (
        <View style={ styles.container }>
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
            <StatCard { ...getAverageDistanceBetweenServices() }/>
            <StatCard { ...getAverageTimeBetweenServices() } />
            <BarChartView
                chartData={ serviceFrequencyByOdometer?.barChartData }
                legend={ serviceFrequencyByOdometer?.legend }
                title={ {
                    title: t("statistics.service.frequency_distribution_by_odometer.title"),
                    description: t(
                        "statistics.service.frequency_distribution_by_odometer.description",
                        { value: formatWithUnit(SERVICE_FREQUENCY_INTERVAL, serviceFrequencyByOdometer?.unitText) }
                    )
                } }
                yAxisTitle={ t("statistics.service.frequency_distribution_by_odometer.y_axis") }
                formatValue={ (value) => `${ value } ${ t("common.count") }` }
                formatYAxisLabelAsValue={ false }
                formatLabel={ (label) => formatWithUnit(label, serviceFrequencyByOdometer?.unitText) }
                showsLegend={ false }
                isLoading={ !serviceFrequencyByOdometer }
            />
            <BarChartView
                chartData={ serviceLogsByDateWindow?.barChartData }
                legend={ serviceLogsByDateWindow?.legend }
                title={ {
                    title: t("statistics.service.total_amount_by_date.title")
                } }
                yAxisTitle={ t(
                    "statistics.service.total_amount_by_date.y_axis",
                    { unit: serviceLogsByDateWindow?.unitText }
                ) }
                formatValue={ (value) => formatWithUnit(value, serviceLogsByDateWindow?.unitText) }
                formatLabel={
                    (label) => dayjs(label).format(getDateFormatTemplateByRangeUnit(serviceLogsByDateWindow?.rangeUnit))
                }
                formatLegend={ (label) => t(`expenses.types.${ label }`) }
                showsLegend={ false }
                isLoading={ !serviceLogsByDateWindow }
            />
            <DonutChartView
                title={ {
                    title: t("statistics.service.expense_distribution_by_type")
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
                    title: t("statistics.service.expense_distribution_by_service_item")
                } }
                chartData={ serviceItemByType?.donutChartData }
                legend={ serviceItemByType?.legend }
                formatLabel={ (label) => t(`service.items.types.${ label }`) }
                formatDescription={ (description) => formatWithUnit(description, serviceItemByType?.unitText) }
                formatLegend={ (label) => t(`service.items.types.${ label }`) }
                legendPosition="right"
                isLoading={ !serviceItemByType }
            />
            <ServiceForecastView carId={ carId }/>
        </View>
    );
}

const styles = StyleSheet.create(({
    container: {
        gap: SEPARATOR_SIZES.small
    }
}));