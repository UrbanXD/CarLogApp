export function convertOdometerValueToKilometer(value: number, conversionFactor: number): number {
    return Math.round(value * conversionFactor);
}

export function convertOdometerValueFromKilometer(value: number, conversionFactor: number): number {
    return Math.round(value / conversionFactor);
}