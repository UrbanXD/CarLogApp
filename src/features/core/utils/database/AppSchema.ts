import { column, Schema, TableV2 } from "@powersync/react-native";

export const USERS_TABLE = "users";
export const CARS_TABLE = "cars";
export const SERVICE_TABLE = "service";

const users = new TableV2({
    id: column.text,
    firstname: column.text,
    lastname: column.text
});

const cars = new TableV2({
    id: column.text,
    owner: column.text,
    name: column.text,
    brand: column.text,
    model: column.text,
    odometer_measurement: column.text,
    odometer_value: column.integer,
    fuel_type: column.text,
    fuel_measurement: column.text,
    fuel_tank_size: column.integer,
    image: column.text,
})

const service = new TableV2({
    id: column.text,
    car: column.text,
    date: column.text,
    odometer: column.text,
    price: column.integer,
    type: column.text,
    works: column.text,
    mechanic: column.text,
    comment: column.text
})

export const AppSchema = new Schema({
    cars,
    users,
    service
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UsersType = DatabaseType["users"];
export type CarsType = DatabaseType["cars"];
export type ServiceType = DatabaseType["service"];