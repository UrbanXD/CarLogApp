import { userTable } from "./tables/user.ts";
import { carTable } from "./tables/car.ts";
import { odometerTable } from "./tables/odometer.ts";
import { fuelTankTable } from "./tables/fuelTank.ts";
import { makeTable } from "./tables/make.ts";
import { modelTable } from "./tables/model.ts";
import { AttachmentTable } from "@powersync/attachments";
import { Schema } from "@powersync/react-native";
import { odometerLogTable } from "./tables/odometerLog.ts";
import { fuelLogTable } from "./tables/fuelLog.ts";
import { expenseTable } from "./tables/expense.ts";
import { expenseTypeTable } from "./tables/expenseType.ts";
import { fuelTypeTable } from "./tables/fuelType.ts";
import { odometerUnitTable } from "./tables/odometerUnit.ts";
import { odometerLogTypeTable } from "./tables/odometerLogType.ts";
import { fuelUnitTable } from "./tables/fuelUnit.ts";
import { currencyTable } from "./tables/currency.ts";

export const AppSchema = new Schema({
    attachments: new AttachmentTable(),
    user_account: userTable,
    car: carTable,
    odometer: odometerTable,
    odometer_unit: odometerUnitTable,
    odometer_log: odometerLogTable,
    odometer_log_type: odometerLogTypeTable,
    fuel_tank: fuelTankTable,
    fuel_unit: fuelUnitTable,
    fuel_log: fuelLogTable,
    fuel_type: fuelTypeTable,
    make: makeTable,
    model: modelTable,
    expense: expenseTable,
    expense_type: expenseTypeTable,
    currency: currencyTable
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UserTableRow = DatabaseType["user_account"];
export type MakeTableRow = DatabaseType["make"];
export type ModelTableRow = DatabaseType["model"];
export type CarTableRow = DatabaseType["car"];
export type OdometerTableRow = DatabaseType["odometer"];
export type OdometerLogTableRow = DatabaseType["odometer_log"];
export type FuelTankTableRow = DatabaseType["fuel_tank"];
export type FuelLogTableRow = DatabaseType["fuel_log"];
export type ExpenseTableRow = DatabaseType["expense"];
export type ExpenseTypeTableRow = DatabaseType["expense_type"];