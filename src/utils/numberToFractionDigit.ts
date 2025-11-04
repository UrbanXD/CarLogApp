export function numberToFractionDigit(number: number, fractionDigits?: number = 2): number {
    return Number(number.toFixed(fractionDigits).replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1"));
}

