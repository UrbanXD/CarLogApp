import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { TotalComparisonStat, TrendStat } from "../../model/dao/statisticsDao.ts";
import { LineChartView } from "../charts/LineChartView.tsx";
import { ExpenseTypeEnum } from "../../../expense/model/enums/ExpenseTypeEnum.ts";
import { StyleSheet, View } from "react-native";
import { StatCard } from "../StatCard.tsx";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { useTranslation } from "react-i18next";

type FuelConsumptionStatisticsProps = {
    carId?: string
    currency?: Currency
    from: string
    to: string
}

export function FuelConsumptionStatistics({
    carId,
    currency,
    from,
    to
}: FuelConsumptionStatisticsProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [data, setData] = useState<TrendStat>(null);
    const [fuelLogStat, setFuelLogStat] = useState<TotalComparisonStat | null>(null);

    useEffect(() => {
        (async () => {
            const resultFuelLogStat = await statisticsDao.getExpenseTotalComparison({
                carId: carId,
                from,
                to,
                expenseType: ExpenseTypeEnum.FUEL
            });

            setFuelLogStat(resultFuelLogStat);
            setData(await statisticsDao.getFuelConsumption2({ carId, from, to }));
        })();
    }, [carId, from, to]);

    return (
        <>
            <LineChartView graphData={ data?.lineChartData ?? [] }/>
            <View style={ styles.mainStatContainer }>
                <View style={ styles.infoStatContainer }>
                    {
                        fuelLogStat &&
                       <>
                          <StatCard
                             label={ t("statistics.service.total_amount") }
                             value={ `${ fuelLogStat.total } ${ currency?.symbol }` }
                             isPositive={ fuelLogStat.totalTrend.isTrendPositive }
                             trend={ `${ fuelLogStat.totalTrend.trendSymbol } ${ fuelLogStat.totalTrend.trend }` }
                             trendDescription={ t("statistics.compared_to_previous_cycle") }
                          />
                          <StatCard
                             label={ t("statistics.service.avg_amount") }
                             value={ `${ fuelLogStat.average } ${ currency?.symbol }` }
                             isPositive={ fuelLogStat.averageTrend.isTrendPositive }
                             trend={ `${ fuelLogStat.averageTrend.trendSymbol } ${ fuelLogStat.averageTrend.trend }` }
                             trendDescription={ t("statistics.compared_to_previous_cycle") }
                          />
                          <StatCard
                             label={ t("statistics.service.max_amount") }
                             value={ `${ fuelLogStat.max.value } ${ currency?.symbol }` }
                          />
                       </>
                    }
                </View>
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