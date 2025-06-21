import { AttachmentTable } from "@powersync/attachments";
import { column, Schema, Table } from "@powersync/react-native";

export const USER_TABLE = "user";
export const CAR_TABLE = "car";
export const SERVICE_TABLE = "service";

const user = new Table({
    id: column.text,
    email: column.text,
    firstname: column.text,
    lastname: column.text,
    avatarImage: column.text,
    avatarColor: column.text
});

const car = new Table({
    id: column.text,
    owner: column.text,
    name: column.text,
    brand: column.text,
    model: column.text,
    odometerMeasurement: column.text,
    odometerValue: column.integer,
    fuelType: column.text,
    fuelMeasurement: column.text,
    fuelTankSize: column.integer,
    image: column.text,
    createdAt: column.text
});

const service = new Table({
    id: column.text,
    car: column.text,
    date: column.text,
    odometer: column.text,
    price: column.integer,
    type: column.text,
    works: column.text,
    mechanic: column.text,
    comment: column.text
});

export const AppSchema = new Schema({
    car,
    user,
    service,
    attachments: new AttachmentTable()
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UserTableType = DatabaseType["user"];
export type CarTableType = DatabaseType["car"];
export type ServiceTableType = DatabaseType["service"];