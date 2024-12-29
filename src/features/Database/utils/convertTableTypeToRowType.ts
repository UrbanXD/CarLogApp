import { RowTableType } from "../connector/powersync/AppSchema"

export const convertTableTypeToRowType = (data: any) => {
    return {
        ...data
    } as RowTableType
}