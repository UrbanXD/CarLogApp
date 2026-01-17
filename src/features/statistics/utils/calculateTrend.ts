import { numberToFractionDigit } from "../../../utils/numberToFractionDigit.ts";
import i18n from "../../../i18n/index.ts";

export type Trend = {
    trend: string
    trendSymbol: string
    isTrendPositive?: boolean
}

export type TrendOptions = {
    diffFormat?: "compact" | "standard" | "percent" | null
    trendSymbols?: {
        positive?: string
        negative?: string
        equal?: string
    }
    formatTrend?: (value: number | string) => string
}

export function calculateTrend(current: number = 0, previous: number = 0, options: TrendOptions = {}): Trend {
    const { diffFormat = "percent", trendSymbols, formatTrend } = options;

    const diff = numberToFractionDigit(current - previous);
    const absoluteDiff = Math.abs(diff);

    let trend = "";

    if(diffFormat === "percent") {
        if(previous === 0) {
            const rawPercent = (diff === 0) ? 0 : 100;

            trend = `${ numberToFractionDigit(rawPercent, 2) }%`;
        } else {
            const rawPercent = (diff / previous) * 100;

            trend = `${ numberToFractionDigit(Math.abs(rawPercent), 1) }%`;
        }
    } else {
        trend = !diffFormat
                ? absoluteDiff.toString()
                : absoluteDiff.toLocaleString(i18n.language, { notation: diffFormat, maximumFractionDigits: 2 });
    }

    const trendSymbol =
        diff > 0
        ? trendSymbols?.positive ?? "↑"
        : diff < 0
          ? trendSymbols?.negative ?? "↓"
          : trendSymbols?.equal ?? "≈";

    return {
        trend: formatTrend ? formatTrend(trend) : trend,
        trendSymbol,
        isTrendPositive: diff > 0 ? true : diff < 0 ? false : undefined
    };
}