export const formatNumber = (number: number, compact: boolean = false) => {
    const locales = compact ? "hu" : "de";

    return Intl.NumberFormat(locales, { notation: compact ? "compact" : "standard" }).format(number);
}
