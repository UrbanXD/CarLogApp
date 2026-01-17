type FormatTrendArgs = {
    trend?: string | null
    trendSymbol?: string
    customFormat?: (trend: string, trendSymbol?: string) => string
}

export function formatTrend({ trend, trendSymbol, customFormat }: FormatTrendArgs): string | null {
    if(!trend) return null;

    if(customFormat) return customFormat(trend, trendSymbol);
    if(trendSymbol) return `${ trendSymbol } ${ trend }`;

    return trend;
}