import { column, Table } from "@powersync/react-native";

export const FUEL_TANK_TABLE = "fuel_tank";

export const fuelTankTable = new Table({
    id: column.text,
    car_id: column.text,
    type_id: column.integer,
    unit_id: column.integer,
    capacity: column.integer
});