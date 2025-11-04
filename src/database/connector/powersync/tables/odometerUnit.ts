import { column, Table } from "@powersync/react-native";

export const ODOMETER_UNIT_TABLE = "odometer_unit";

export const odometerUnitTable = new Table({
    id: column.integer,
    key: column.text,
    short: column.text,
    conversion_factor: column.real
});