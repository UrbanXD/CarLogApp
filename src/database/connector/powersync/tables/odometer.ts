import { column, Table } from "@powersync/react-native";

export const ODOMETER_TABLE = "odometer";

export const odometerTable = new Table({
    id: column.text,
    car_id: column.text,
    value: column.integer,
    measurement: column.text
});