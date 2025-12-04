import dayjs from "dayjs";

export type RangeUnit = "year" | "month" | "day" | "hour";

export function getRangeUnit(from: string, to: string): RangeUnit {
    const start = dayjs(from);
    const end = dayjs(to);
    const diffHours = end.diff(start, "hour");
    const diffDays = end.diff(start, "day");
    const diffMonths = end.diff(start, "month");

    if(diffHours < 24) return "hour";
    if(diffDays < 32 && diffMonths === 0) return "day";
    if(diffMonths < 12) return "month";
    return "year";
}