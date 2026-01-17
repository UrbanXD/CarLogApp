import { column, Table } from "@powersync/react-native";

export const FUEL_UNIT_TABLE = "fuel_unit" as const;

export const fuelUnitTable = new Table({
    id: column.integer,
    key: column.text,
    short: column.text,
    conversion_factor: column.real
});