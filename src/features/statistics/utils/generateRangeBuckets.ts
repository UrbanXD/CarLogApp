import { RangeUnit } from "./getRangeUnit.ts";
import dayjs from "dayjs";

export function generateRangeBuckets(from: string, to: string, rangeUnit: RangeUnit): Array<string> {
    const list: string[] = [];
    let start = dayjs(from);
    const end = dayjs(to);

    while(start <= end) {
        if(rangeUnit === "hour") {
            list.push(start.format("YYYY-MM-DD HH:00"));
            start = start.add(1, "hour");
        } else if(rangeUnit === "day") {
            list.push(start.format("YYYY-MM-DD"));
            start = start.add(1, "day");
        } else if(rangeUnit === "month") {
            list.push(start.format("YYYY-MM"));
            start = start.add(1, "month");
        } else {
            list.push(start.format("YYYY"));
            start = start.add(1, "year");
        }
    }

    return list;
}