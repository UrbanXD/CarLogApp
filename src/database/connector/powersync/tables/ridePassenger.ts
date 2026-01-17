import { column, Table } from "@powersync/react-native";

export const RIDE_PASSENGER_TABLE = "ride_passenger" as const;

export const ridePassengerTable = new Table({
    id: column.text,
    owner_id: column.text,
    ride_log_id: column.text,
    passenger_id: column.text,
    passenger_order: column.integer
});