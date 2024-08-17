export const formatNumber = (number: number, compact: boolean = false) => {
    const options = compact ? { notation: "compact" } : {};
    const locales = compact ? "hu" : "de";

    const formatter = Intl.NumberFormat('hu', { notation: 'compact' });
    return Intl.NumberFormat(locales, { notation: compact ? "compact" : "standard" }).format(number);
}
