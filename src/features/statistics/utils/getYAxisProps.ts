import { numberToFractionDigit } from "../../../utils/numberToFractionDigit.ts";

type GetYAxisPropsArgs = {
    maxValue: number
    fontSize: number
    steps?: number
    forceFractionValues?: boolean
    fractionValuesThreshold?: number
    fractionValuesPrecision?: number
    formatLabel?: (label: string | number) => string
}

const DEFAULT_STEPS = 6;
const DEFAULT_FRACTION_VALUES_THRESHOLD = 10;
const DEFAULT_FRACTION_VALUES_PRECISION = 2;

export function getYAxisProps({
    maxValue,
    fontSize,
    steps,
    forceFractionValues = false,
    fractionValuesThreshold,
    fractionValuesPrecision,
    formatLabel
}: GetYAxisPropsArgs) {
    let chartMaxValue = maxValue + (maxValue * 0.20);
    if(!forceFractionValues && chartMaxValue > (fractionValuesThreshold ?? DEFAULT_FRACTION_VALUES_THRESHOLD)) {
        chartMaxValue = Math.round(chartMaxValue);
    }

    const showFractionalValues = forceFractionValues || chartMaxValue <= (fractionValuesThreshold ?? DEFAULT_FRACTION_VALUES_THRESHOLD);
    const precision = showFractionalValues ? (fractionValuesPrecision ?? DEFAULT_FRACTION_VALUES_PRECISION) : 0;

    const formatYLabel = (label: string | number) => {
        let labelValue = label.toString();
        if(showFractionalValues && typeof label === "number" || !Number.isNaN(Number(label))) {
            const numberLabel = Number(label);
            labelValue = numberToFractionDigit(numberLabel, precision).toString();
        }

        return formatLabel?.(labelValue) ?? labelValue;
    };

    let longestLabelLength = 0;
    for(let i = 0; i <= (steps ?? DEFAULT_STEPS); i++) {
        const formattedLabel = formatYLabel((chartMaxValue / (steps ?? DEFAULT_STEPS)) * i);
        if(formattedLabel.length > longestLabelLength) longestLabelLength = formattedLabel.length;
    }

    const zeroLabel = formatLabel?.(0) ?? "0";
    if(zeroLabel.length > longestLabelLength) {
        longestLabelLength = zeroLabel.length;
    }

    const yAxisLabelWidth = fontSize * 0.55 * (longestLabelLength + 1.5);

    return {
        chartMaxValue,
        yAxisLabelWidth,
        steps,
        showFractionalValues,
        precision,
        formatYLabel
    };
}