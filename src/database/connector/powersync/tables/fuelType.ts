import { column, Table } from "@powersync/react-native";

export const FUEL_TYPE_TABLE = "fuel_type";

export const fuelTypeTable = new Table({
    id: column.integer,
    key: column.text
});