import { DataTable } from "react-native-paper";
import {TableHeaderProp} from "./TableHeaderProp";
import React from "react";

const TableHeader: React.FC<TableHeaderProp> = ({ headerStyle, titleStyle, titleTextStyle, titles }) => {
    return (
        <DataTable.Header style={ headerStyle() }>
            {
                titles.map((title, index) => {
                    return (
                        <DataTable.Title
                            key={ index }
                            style={ titleStyle(index + 1) }
                            textStyle={ titleTextStyle() }
                        >
                            { title }
                        </DataTable.Title>
                    )
                })
            }
        </DataTable.Header>
    )
}

export default TableHeader;