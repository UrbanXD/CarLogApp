import React from "react";
import { StandingProp } from "./Standing.prop";
import {DataTable} from "react-native-paper";
import {Dimensions, View, ViewStyle} from "react-native";
import TableHeader from "../table/TableHeader";
import TableRow from "../table/TableRow";
import {theme} from "../../styles/theme";

const rowStyle = (row: number = 1): ViewStyle | {} => {
    return {
        // backgroundColor: (row % 2 == 0) ? "white" : "black",
        flex: 2
    }
}

const columnStyle = (column?: number): ViewStyle | {} => {
    const style = { };
    switch (column){
        case 1:
            return {
                ...style,
                maxWidth: "7%",
                minWidth: "7%",
            }
        case 2:
            return {
                ...style,
                maxWidth: "50%",
                minWidth: "50%",
            }
        case 6:
            return {
                ...style,
                maxWidth: "14%",
                minWidth: "14%",
                justifyContent: "center",
            }
        case 3: case 4: case 5: case 7:
            return {
                ...style,
                maxWidth: "7.5%",
                minWidth: "7.5%",
                justifyContent: 'center',
            }
        default:
            return style;
    }
}

const Standing: React.FC<StandingProp> = (standings) => {
    return (
        <DataTable style={{
            backgroundColor: "transparent",
        }}>
            <TableHeader
                headerStyle={ () => {
                    return {
                        borderBottomWidth: 3,
                        borderBottomColor: theme.colors.secondaryColor2,
                        backgroundColor: theme.colors.primaryBackground1,
                        borderTopStartRadius: 20,
                        borderTopEndRadius: 20
                    }
                }}
                titleStyle={ columnStyle }
                titleTextStyle={ () => {
                    return {
                        fontFamily: "Gilroy",
                        fontSize: 16,
                        textAlign: "center",
                        color: theme.colors.primaryColor,
                    }
                }}
                titles={ [" ", "Csapat", "GY", "D", "V", "GK", "P"] }
            />
            {
                standings.standings.map((standing, index) => {
                    return (
                        <TableRow
                            key={ index }
                            row={ index }
                            getRowStyle={ rowStyle }
                            getCellStyle={ columnStyle }
                            cellTextStyle={ (column) => {
                                return {
                                    fontSize: 15,
                                    fontFamily: "Gilroy",
                                    // textAlign: "center",
                                    // alignSelf: "center",
                                    color: theme.colors.secondaryColor1,
                                    backgroundColor: column === 1 ? "red" : "transparent",
                                    width: column === 1 ? 30 : "auto", height: column === 1 ? 30 : "auto",
                                    // borderRadius: column === 1 ? 50 : "auto",
                                }
                            }}
                            cellData={ [standing.rank, standing.team.name, standing.win, standing.draw, standing.lose, `${ standing.goals.for }-${ standing.goals.against }`, standing.points] }
                        />
                    );
                })
            }
        </DataTable>
    )
}

export default Standing;