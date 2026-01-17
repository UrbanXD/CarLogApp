export function formatWithUnit(value: number | string, unit?: string | null): string {
    if(!unit) return value.toString();

    return `${ value } ${ unit }`;
}