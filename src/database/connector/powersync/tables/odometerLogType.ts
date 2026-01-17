import { column, Table } from "@powersync/react-native";

export const ODOMETER_LOG_TYPE_TABLE = "odometer_log_type" as const;

export const odometerLogTypeTable = new Table({
    id: column.integer,
    key: column.text
});