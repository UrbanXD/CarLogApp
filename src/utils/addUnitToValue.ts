export const addUnitToValue = (value: number | string, unit?: string) => {
    let result = value.toString();
    if(unit) result += ` ${ unit }`;

    return result;
};