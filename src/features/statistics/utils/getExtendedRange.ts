import { getRangeUnit, RangeUnit } from "./getRangeUnit.ts";
import dayjs from "dayjs";

export function getExtendedRange(from: string, to: string): {
    extendedFrom: string,
    extendedTo: string,
    rangeUnit: RangeUnit
} {
    const rangeUnit = getRangeUnit(from, to);

    let extendedFrom = from;
    let extendedTo = to;

    switch(rangeUnit) {
        case "hour":
        case "day":
            extendedFrom = dayjs(from).subtract(1, "day").toISOString();
            extendedTo = dayjs(to).add(1, "day").toISOString();
            break;
        case "month":
        case "year":
            extendedFrom = dayjs(from).subtract(1, "month").toISOString();
            extendedTo = dayjs(to).add(1, "month").toISOString();
    }

    return { extendedFrom, extendedTo, rangeUnit };
}