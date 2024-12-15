import { RowTableType } from "./database/powersync/AppSchema"

export const convertTableTypeToRowType = (data: any) => {
    return {
        ...data
    } as RowTableType
}