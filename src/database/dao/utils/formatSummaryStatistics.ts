import { StatisticsAggregateQueryResult } from "./getStatisticsAggregateQuery.ts";
import { numberToFractionDigit } from "../../../utils/numberToFractionDigit.ts";
import { calculateTrend, TrendOptions } from "../../../features/statistics/utils/calculateTrend.ts";
import { Stat } from "../types/statistics.ts";

type FormatSummaryStatisticsOptions<Record = number> = {
    recordMapper?: (record: Record) => Stat
    trendOptions?: TrendOptions
}

export function formatSummaryStatistics<Record = number>(
    result: StatisticsAggregateQueryResult<Record>,
    options?: FormatSummaryStatisticsOptions<Record>
) {
    const { recordMapper, trendOptions } = options ?? {};

    const recordFormat = (record?: Record | null): Stat | null => {
        if(record == null) return null;
        if(recordMapper) return recordMapper(record);

        if(isNaN(Number(record)) || typeof record !== "number") return null;

        return { value: numberToFractionDigit(record) };
    };

    const max = recordFormat(result?.current_max_record);
    const min = recordFormat(result?.current_min_record);
    const total = numberToFractionDigit(result?.current_total ?? 0);
    const average = numberToFractionDigit(result?.current_avg ?? 0);
    const median = numberToFractionDigit(result?.current_median ?? 0);
    const count = numberToFractionDigit(result?.current_count ?? 0);
    const previousWindowMax = recordFormat(result?.previous_max_record);
    const previousWindowMin = recordFormat(result?.previous_min_record);
    const previousWindowTotal = numberToFractionDigit(result?.previous_total ?? 0);
    const previousWindowAverage = numberToFractionDigit(result?.previous_avg ?? 0);
    const previousWindowMedian = numberToFractionDigit(result?.previous_median ?? 0);
    const previousWindowCount = numberToFractionDigit(result?.previous_count ?? 0);

    return {
        max,
        min,
        total,
        average,
        median,
        count,
        previousWindowMax,
        previousWindowMin,
        previousWindowTotal,
        previousWindowAverage,
        previousWindowMedian,
        previousWindowCount,
        totalTrend: calculateTrend(total, previousWindowTotal, trendOptions),
        averageTrend: calculateTrend(average, previousWindowAverage, trendOptions),
        medianTrend: calculateTrend(median, previousWindowMedian, trendOptions),
        countTrend: calculateTrend(count, previousWindowCount, trendOptions)
    };
}