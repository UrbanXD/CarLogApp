import { column, Table } from "@powersync/react-native";

export const ODOMETER_CHANGE_LOG_TABLE = "odometer_change_log" as const;

export const odometerChangeLogTable = new Table({
    id: column.text,
    car_id: column.text,
    odometer_log_id: column.text,
    note: column.text,
    date: column.text
});