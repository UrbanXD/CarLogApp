import dayjs from "dayjs";

export type RangeUnit = "year" | "month" | "day" | "hour";

export function getRangeUnit(from: string | null, to: string | null): RangeUnit {
    if(from === null && to === null) return "month";

    const start = dayjs(from);
    const end = dayjs(to);
    const diffHours = end.diff(start, "hour");
    const diffDays = end.diff(start, "day");
    const diffMonths = end.diff(start, "month");

    if(diffHours < 24) return "hour";
    if(diffDays < 32 && (diffMonths === 0 || diffMonths === 1)) return "day";
    if(diffMonths < 12) return "month";
    return "year";
}