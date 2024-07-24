import {TextStyle, ViewStyle} from "react-native";

export interface TableRowProp {
    row: number,
    getRowStyle: (row?: number) => {} | ViewStyle,
    getCellStyle:  (column?: number) => {} | ViewStyle,
    cellTextStyle: (column?: number) => {} | TextStyle,
    cellData: any[]
}