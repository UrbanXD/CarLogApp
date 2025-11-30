import { RangeUnit } from "./getRangeUnit.ts";

export function getDateFormatTemplateByRangeUnit(unit: RangeUnit): string {
    switch(unit) {
        case "year":
            return "YYYY";
        case "month":
            return "MMM YYYY";
        case "day":
            return "L";
        case "hour":
            return "L LT";
        default:
            return "L";
    }
}