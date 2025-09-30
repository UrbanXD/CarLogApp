import { column, Table } from "@powersync/react-native";

export const ODOMETER_LOG_TYPE = "odometer_log_type";

export const odometerLogTypeTable = new Table({
    id: column.integer,
    key: column.text
});