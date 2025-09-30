const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.609344;

export function kilometerToMile(value: number): number {
    return Number((value * KM_TO_MI).toFixed(2));
}

export function mileToKilometer(value: number): number {
    return value * MI_TO_KM;
}