import { column, Table } from "@powersync/react-native";

export const PASSENGER_TABLE = "passenger" as const;

export const passengerTable = new Table({
    id: column.text,
    owner_id: column.text,
    name: column.text
});