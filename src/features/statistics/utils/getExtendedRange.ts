import { getRangeUnit, RangeUnit } from "./getRangeUnit.ts";
import dayjs from "dayjs";

export function getExtendedRange(from: string | null, to: string | null): {
    extendedFrom: string | null,
    extendedTo: string | null,
    rangeUnit: RangeUnit
} {
    const rangeUnit = getRangeUnit(from, to);

    let extendedFrom = from;
    let extendedTo = to;

    switch(rangeUnit) {
        case "hour":
        case "day":
            if(from) extendedFrom = dayjs(from).subtract(1, "day").toISOString();
            if(to) extendedTo = dayjs(to).add(1, "day").toISOString();
            break;
        case "month":
        case "year":
            if(from) extendedFrom = dayjs(from).subtract(1, "month").toISOString();
            if(to) extendedTo = dayjs(to).add(1, "month").toISOString();
    }

    return { extendedFrom, extendedTo, rangeUnit };
}