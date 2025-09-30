import { column, Table } from "@powersync/react-native";

export const ODOMETER_LOG_TABLE = "odometer_log";

export const odometerLogTable = new Table({
    id: column.text,
    car_id: column.text,
    type: column.text,
    value: column.integer,
    note: column.text,
    date: column.text
});