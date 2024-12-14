import { AttachmentTable } from "@powersync/attachments";
import {Column, ColumnType, Schema, Table } from "@powersync/react-native";

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
        new Column({name: "odometerMeasurement", type: ColumnType.TEXT}),
        new Column({name: "odometerValue", type: ColumnType.INTEGER}),
        new Column({name: "fuelType", type: ColumnType.TEXT}),
        new Column({name: "fuelMeasurement", type: ColumnType.TEXT}),
        new Column({name: "fuelTankSize", type: ColumnType.INTEGER}),
        new Column({name: "image", type: ColumnType.TEXT}),
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

export const AppSchema = new Schema([
    cars,
    users,
    service,
    new AttachmentTable()
]);

export type DatabaseType = (typeof AppSchema)["types"];
export type UsersType = DatabaseType["users"];
export type CarsType = DatabaseType["cars"];
export type ServiceType = DatabaseType["service"];