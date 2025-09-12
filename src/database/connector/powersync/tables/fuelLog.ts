import { column, Table } from "@powersync/react-native";

export const FUEL_LOG_TABLE = "fuel_log";

export const fuelLogTable = new Table({
    id: column.text,
    expense_id: column.text,
    current_odometer: column.integer,
    quantity: column.real,
    price_per_unit: column.real,
    unit: column.text
});