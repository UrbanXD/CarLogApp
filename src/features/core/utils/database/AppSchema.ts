import {Column, column, ColumnType, Schema, Table, TableV2 } from "@powersync/react-native";

export const USERS_TABLE = "users";
export const CARS_TABLE = "cars";
export const SERVICE_TABLE = "service";

const users = new Table({
    name: USERS_TABLE,
    columns: [
        new Column({name: "id", type: ColumnType.TEXT}),
        new Column({name: "firstname", type: ColumnType.TEXT}),
        new Column({name: "lastname", type: ColumnType.TEXT})
    ],
});

const cars = new Table({
    name: CARS_TABLE,
    columns: [
        new Column({name: "id", type: ColumnType.TEXT}),
        new Column({name: "owner", type: ColumnType.TEXT}),
        new Column({name: "name", type: ColumnType.TEXT}),
        new Column({name: "brand", type: ColumnType.TEXT}),
        new Column({name: "model", type: ColumnType.TEXT}),
        new Column({name: "odometer_measurement", type: ColumnType.TEXT}),
        new Column({name: "odometer_value", type: ColumnType.INTEGER}),
        new Column({name: "fuel_type", type: ColumnType.TEXT}),
        new Column({name: "fuel_measurement", type: ColumnType.TEXT}),
        new Column({name: "fuel_tank_size", type: ColumnType.INTEGER}),
        new Column({name: "image_id", type: ColumnType.TEXT}),
    ]
})

const service = new Table({
    name: SERVICE_TABLE,
    columns: [
        new Column({name: "id", type: ColumnType.TEXT}),
        new Column({name: "car", type: ColumnType.TEXT}),
        new Column({name: "date", type: ColumnType.TEXT}),
        new Column({name: "odometer", type: ColumnType.TEXT}),
        new Column({name: "price", type: ColumnType.INTEGER}),
        new Column({name: "type", type: ColumnType.TEXT}),
        new Column({name: "works", type: ColumnType.TEXT}),
        new Column({name: "mechanic", type: ColumnType.TEXT}),
        new Column({name: "comment", type: ColumnType.TEXT}),
    ]
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