import { column, Table } from "@powersync/react-native";

export const FUEL_TYPE_TABLE = "fuel_type" as const;

export const fuelTypeTable = new Table({
    id: column.integer,
    key: column.text
});