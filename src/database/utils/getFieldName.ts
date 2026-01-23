export function getFieldName<FieldName = string>(field: string): FieldName {
    return (field.includes(".") ? field.split(".").pop()! : field) as FieldName;
}