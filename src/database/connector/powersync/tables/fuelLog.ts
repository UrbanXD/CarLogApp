import { column, Table } from "@powersync/react-native";

export const FUEL_LOG_TABLE = "fuel_log";

export const fuelLogTable = new Table({
    id: column.text,
    owner_id: column.text,
    expense_id: column.text,
    odometer_log_id: column.text,
    fuel_unit_id: column.text,
    quantity: column.real
});