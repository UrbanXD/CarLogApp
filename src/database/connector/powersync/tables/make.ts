import { column, Table } from "@powersync/react-native";

export const MAKE_TABLE = "make";

export const makeTable = new Table({
    id: column.text,
    name: column.text
});