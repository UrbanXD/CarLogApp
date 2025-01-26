import { AttachmentTable } from "@powersync/attachments";
import { Column, ColumnType, Schema, Table } from "@powersync/react-native";

export const USER_TABLE = "user";
export const CAR_TABLE = "car";
export const SERVICE_TABLE = "service";

export interface UserTableType {
    id: string
    firstName: string
    lastName: string
}
const user = new Table({
    name: USER_TABLE,
    columns: [
        new Column({name: "id", type: ColumnType.TEXT}),
        new Column({name: "firstname", type: ColumnType.TEXT}),
        new Column({name: "lastname", type: ColumnType.TEXT})
    ],
});

export interface CarTableType {
    id: string
    owner: string
    name: string
    brand: string
    model: string
    odometerMeasurement: string
    odometerValue: number
    fuelType: string
    fuelMeasurement: string
    fuelTankSize: number
    image?: string
    createdAt: string
}
const car = new Table({
    name: CAR_TABLE,
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
        new Column({name: "createdAt", type: ColumnType.TEXT}),
    ]
})

export interface ServiceTableType {
    id: string
    car: string
    date: string
    odometer: string
    price: string
    type: string
    works: string
    mechanic: string
    comment: string
}

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
    car,
    user,
    service,
    new AttachmentTable()
]);

export type DatabaseType = (typeof AppSchema)["types"];
export type RowTableType = DatabaseType[""];