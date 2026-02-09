import { column, Table } from "@powersync/react-native";

export const FUEL_LOG_TABLE = "fuel_log" as const;

export const fuelLogTable = new Table({
    id: column.text,
    car_id: column.text,
    expense_id: column.text,
    odometer_log_id: column.text,
    fuel_unit_id: column.integer,
    quantity: column.real,
    is_price_per_unit: column.integer
});