import { column, Table } from "@powersync/react-native";

export const RIDE_PLACE_TABLE = "ride_place" as const;

export const ridePlaceTable = new Table({
    id: column.text,
    owner_id: column.text,
    ride_log_id: column.text,
    place_id: column.text,
    place_order: column.integer
});