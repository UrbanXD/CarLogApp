import { userTable } from "./tables/user.ts";
import { carTable } from "./tables/car.ts";
import { odometerTable } from "./tables/odometer.ts";
import { fuelTankTable } from "./tables/fuelTank.ts";
import { makeTable } from "./tables/make.ts";
import { modelTable } from "./tables/model.ts";
import { AttachmentTable } from "@powersync/attachments";
import { Schema } from "@powersync/react-native";

export const AppSchema = new Schema({
    attachments: new AttachmentTable(),
    user_account: userTable,
    car: carTable,
    odometer: odometerTable,
    fuel_tank: fuelTankTable,
    make: makeTable,
    model: modelTable
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UserTableRow = DatabaseType["user_account"];
export type MakeTableRow = DatabaseType["make"];
export type ModelTableRow = DatabaseType["model"];
export type CarTableRow = DatabaseType["car"];
export type OdometerTableRow = DatabaseType["odometer"];
export type FuelTankTableRow = DatabaseType["fuel_tank"];