export const addMeasurementToValue = (value: number | string, measurement?: string) => {
    let result = value.toString();
    if(measurement) result += ` ${ measurement }`;

    return result;
};