import { AttachmentTable } from "@powersync/attachments";
import { column, Schema, Table } from "@powersync/react-native";

export const USER_TABLE = "user";
export const CAR_TABLE = "car";
export const SERVICE_TABLE = "service";
export const CAR_BRAND_TABLE = "carBrand";
export const CAR_MODEL_TABLE = "carModel";

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
    fuelValue: column.integer,
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

/* LOCAL ONLY TABLES */
const carBrand = new Table({
    id: column.integer,
    name: column.text
}, { localOnly: true });

const carModel = new Table({
    id: column.integer,
    brand: column.text, // foreign key
    name: column.text,
    startYear: column.integer,
    endYear: column.integer
}, { localOnly: true });
/* LOCAL ONLY TABLES */

export const AppSchema = new Schema({
    car,
    user,
    service,
    attachments: new AttachmentTable(),
    carBrand,
    carModel
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UserTableType = DatabaseType["user"];
export type CarTableType = DatabaseType["car"];
export type ServiceTableType = DatabaseType["service"];
export type CarBrandTableType = DatabaseType["carBrand"];
export type CarModelTableType = DatabaseType["carModel"];