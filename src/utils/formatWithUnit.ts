export function formatWithUnit(value: number | string, unit?: string): string {
    if(!unit) return value.toString();

    return `${ value } ${ unit }`;
}