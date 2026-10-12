import { column, Table } from "@powersync/common";

export const FUEL_TYPE_TABLE = "fuel_type" as const;

export const fuelTypeTable = new Table({
    id: column.integer,
    key: column.text
});