import {TextStyle, ViewStyle} from "react-native";

export interface TableHeaderProp {
    headerStyle: (column?: number) => ViewStyle,
    titleStyle:  (column?: number) => {} | ViewStyle,
    titleTextStyle: (column?: number) => TextStyle,
    titles: string[]
}