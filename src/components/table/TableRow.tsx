import { DataTable } from "react-native-paper";
import React from "react";
import {TableRowProp} from "./TableRowProp";

const TableRow: React.FC<TableRowProp> = ({ row, getRowStyle, getCellStyle, cellTextStyle, cellData }) => {
    return (
        <DataTable.Row style={ getRowStyle(row) }>
            {
                cellData.map((data, index) => {
                    return (
                        <DataTable.Cell
                            key={ index }
                            style={ getCellStyle(index + 1) }
                            textStyle={ cellTextStyle(index + 1) }
                        >
                            { data }
                        </DataTable.Cell>
                    );
                })
            }
        </DataTable.Row>
    )
}

export default TableRow;