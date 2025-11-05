import { column, Table } from "@powersync/react-native";

export const PLACE_TABLE = "place";

export const placeTable = new Table({
    id: column.text,
    owner_id: column.text,
    name: column.text
});