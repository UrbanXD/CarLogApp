import { column, Table } from "@powersync/react-native";

export const FUEL_TANK_TABLE = "fuel_tank";

export const fuelTankTable = new Table({
    id: column.text,
    car_id: column.text,
    type: column.text,
    capacity: column.integer,
    value: column.integer,
    measurement: column.text
});