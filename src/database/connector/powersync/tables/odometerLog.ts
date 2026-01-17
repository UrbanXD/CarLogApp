import { column, Table } from "@powersync/react-native";

export const ODOMETER_LOG_TABLE = "odometer_log" as const;

export const odometerLogTable = new Table({
    id: column.text,
    car_id: column.text,
    type_id: column.integer,
    value: column.integer
});