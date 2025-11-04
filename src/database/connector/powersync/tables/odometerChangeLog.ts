import { column, Table } from "@powersync/react-native";

export const ODOMETER_CHANGE_LOG_TABLE = "odometer_change_log";

export const odometerChangeLogTable = new Table({
    id: column.text,
    owner_id: column.text,
    odometer_log_id: column.text,
    note: column.text,
    date: column.text
});