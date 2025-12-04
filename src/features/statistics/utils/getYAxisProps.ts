import { numberToFractionDigit } from "../../../utils/numberToFractionDigit.ts";

type GetYAxisPropsArgs = {
    maxValue: number
    fontSize: number
    steps: number
    forceFractionValues?: boolean
    fractionValuesThreshold?: number
    precision?: number
    formatLabel?: (label: string | number) => string
}

export function getYAxisProps({
    maxValue,
    fontSize,
    steps = 6,
    forceFractionValues = false,
    fractionValuesThreshold = 10,
    fractionValuesPrecision = 2,
    formatLabel
}: GetYAxisPropsArgs) {
    let chartMaxValue = maxValue + (maxValue * 0.20);
    if(!forceFractionValues && chartMaxValue > fractionValuesThreshold) chartMaxValue = Math.round(chartMaxValue);

    const showFractionalValues = forceFractionValues || chartMaxValue <= fractionValuesThreshold;
    const precision = showFractionalValues ? fractionValuesPrecision : 0;

    const formatYLabel = (label: string | number) => {
        let labelValue = label.toString();
        if(showFractionalValues && typeof label === "number" || !Number.isNaN(Number(label))) {
            const numberLabel = Number(label);
            labelValue = numberToFractionDigit(numberLabel, precision).toString();
        }

        return formatLabel?.(labelValue) ?? labelValue;
    };

    let longestLabelLength = 0;
    for(let i = 0; i <= steps; i++) {
        const formattedLabel = formatYLabel((chartMaxValue / steps) * i);
        if(formattedLabel.length > longestLabelLength) longestLabelLength = formattedLabel.length;
    }

    const zeroLabel = formatLabel?.(0) ?? "0";
    if(zeroLabel.length > longestLabelLength) {
        longestLabelLength = zeroLabel.length;
    }

    const yAxisLabelWidth = fontSize * 0.55 * (longestLabelLength + 1.5 ?? 0);

    return {
        chartMaxValue,
        yAxisLabelWidth,
        steps,
        showFractionalValues,
        precision,
        formatYLabel
    };
}