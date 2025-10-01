import { column, Table } from "@powersync/react-native";

export const ODOMETER_TABLE = "odometer";

export const odometerTable = new Table({
    id: column.text,
    car_id: column.text,
    unit_id: column.integer,
    value: column.integer
});