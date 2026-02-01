import { Trend } from "../../../features/statistics/utils/calculateTrend.ts";

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

