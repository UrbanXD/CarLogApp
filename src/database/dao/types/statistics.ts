import { Trend, TrendOptions } from "../../../features/statistics/utils/calculateTrend.ts";
import { DonutChartItem } from "../../../features/statistics/components/charts/DonutChartView.tsx";
import { LegendType } from "../../../features/statistics/components/charts/common/Legend.tsx";
import { BarChartItem } from "../../../features/statistics/components/charts/BarChartView.tsx";
import { LineChartItem } from "../../../features/statistics/components/charts/LineChartView.tsx";

export type StatisticsFunctionArgs = {
    carId?: string | null
    from: string | null
    to: string | null
    trendOptions?: TrendOptions
}

export type Stat = {
    value: number
    unitText?: string | null
    label?: string | null
    color?: string | null
}

export type SummaryStatistics = {
    max: Stat | null
    min: Stat | null
    total: number
    average: number
    median: number
    count: number
    previousWindowMax: Stat | null
    previousWindowMin: Stat | null
    previousWindowTotal: number
    previousWindowAverage: number
    previousWindowMedian: number
    previousWindowCount: number
    totalTrend: Trend
    averageTrend: Trend
    medianTrend: Trend
    countTrend: Trend | null
    unitText?: string | null
}

export type DonutChartStatistics = {
    chartData: Array<DonutChartItem>
    legend?: LegendType
}

export type BarChartStatistics = {
    chartData: Array<BarChartItem>
    legend?: LegendType
}

export type LineChartStatistics = {
    chartData: Array<LineChartItem>
}

export type Forecast = {
    lastValue: number
    value: number
    date: string | null
    label?: string
    color?: string
}

export type TopListItem = {
    name: string,
    count: number
}

export type TopListStatistics = Array<TopListItem>;
