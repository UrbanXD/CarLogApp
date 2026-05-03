export function numberToFractionDigit(value: number | string | undefined | null, fractionDigits: number = 2): number {
    if(value === undefined || value === null || value === "") return 0;

    const parsedNumber = Number(value);
    if(isNaN(parsedNumber)) return 0;

    return Number(parsedNumber.toFixed(fractionDigits).replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1"));
}

