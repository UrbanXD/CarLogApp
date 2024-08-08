import {column, Schema, TableV2} from "@powersync/react-native";

export const USERS_TABLE = "users";
export const CARS_TABLE = "cars";

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
    type: column.text,
    image: column.text,
    selected: column.integer // 1-true : 0-false
})

export const AppSchema = new Schema({
    cars,
    users,
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UsersType = DatabaseType["users"];
export type CarsType = DatabaseType["cars"]