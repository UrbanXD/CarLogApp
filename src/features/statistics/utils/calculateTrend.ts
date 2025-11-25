import { numberToFractionDigit } from "../../../utils/numberToFractionDigit.ts";
import i18n from "../../../i18n/index.ts";

type Options = {
    diffFormat?: "compact" | "standard" | "percent" | null,
    trendSymbols?: {
        positive?: string,
        negative?: string,
        equal?: string
    }
}

export function calculateTrend(current?: number = 0, previous?: number = 0, options?: Options = {}) {
    const { diffFormat = "percent", trendSymbols } = options;

    const diff = numberToFractionDigit(current - previous);
    const absoluteDiff = Math.abs(diff);

    let trend = 0;

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
                ? absoluteDiff
                : absoluteDiff.toLocaleString(i18n.language, { notation: diffFormat, maximumFractionDigits: 2 });
    }

    const trendSymbol =
        diff > 0
        ? trendSymbols?.positive ?? "↑"
        : diff < 0
          ? trendSymbols?.negative ?? "↓"
          : trendSymbols?.equal ?? "≈";

    const isTrendPositive = diff > 0 ? true : diff < 0 ? false : undefined;

    return { trend, trendSymbol, isTrendPositive };
}