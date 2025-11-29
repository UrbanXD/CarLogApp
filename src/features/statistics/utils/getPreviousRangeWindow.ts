import dayjs from "dayjs";

export function getPreviousRangeWindow(from: string, to: string): { from: string, to: string } {
    const duration: number = dayjs(to).diff(dayjs(from));

    return {
        from: dayjs(from).subtract(duration, "millisecond").toISOString(),
        to: from
    };
}