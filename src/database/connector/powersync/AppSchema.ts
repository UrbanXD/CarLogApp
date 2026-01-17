import { userTable } from "./tables/user.ts";
import { carTable } from "./tables/car.ts";
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
import { odometerChangeLogTable } from "./tables/odometerChangeLog.ts";
import { serviceTypeTable } from "./tables/serviceType.ts";
import { serviceLog } from "./tables/serviceLog.ts";
import { serviceItem } from "./tables/serviceItem.ts";
import { serviceItemTypeTable } from "./tables/serviceItemType.ts";
import { rideLogTable } from "./tables/rideLog.ts";
import { ridePlaceTable } from "./tables/ridePlace.ts";
import { ridePassengerTable } from "./tables/ridePassenger.ts";
import { placeTable } from "./tables/place.ts";
import { passengerTable } from "./tables/passenger.ts";
import { rideExpenseTable } from "./tables/rideExpense.ts";

export const AppSchema = new Schema({
    attachments: new AttachmentTable(),
    user_account: userTable,
    car: carTable,
    odometer_unit: odometerUnitTable,
    odometer_log: odometerLogTable,
    odometer_change_log: odometerChangeLogTable,
    odometer_log_type: odometerLogTypeTable,
    fuel_tank: fuelTankTable,
    fuel_unit: fuelUnitTable,
    fuel_log: fuelLogTable,
    fuel_type: fuelTypeTable,
    make: makeTable,
    model: modelTable,
    expense: expenseTable,
    expense_type: expenseTypeTable,
    currency: currencyTable,
    service_log: serviceLog,
    service_type: serviceTypeTable,
    service_item: serviceItem,
    service_item_type: serviceItemTypeTable,
    ride_log: rideLogTable,
    ride_expense: rideExpenseTable,
    ride_place: ridePlaceTable,
    ride_passenger: ridePassengerTable,
    place: placeTable,
    passenger: passengerTable
});

export type DatabaseType = (typeof AppSchema)["types"];
export type UserTableRow = DatabaseType["user_account"];
export type MakeTableRow = DatabaseType["make"];
export type ModelTableRow = DatabaseType["model"];
export type CarTableRow = DatabaseType["car"];
export type OdometerUnitTableRow = DatabaseType["odometer_unit"];
export type OdometerLogTableRow = DatabaseType["odometer_log"];
export type OdometerChangeLogTableRow = DatabaseType["odometer_change_log"];
export type OdometerLogTypeTableRow = DatabaseType["odometer_log_type"];
export type FuelTankTableRow = DatabaseType["fuel_tank"];
export type FuelUnitTableRow = DatabaseType["fuel_unit"];
export type FuelLogTableRow = DatabaseType["fuel_log"];
export type FuelTypeTableRow = DatabaseType["fuel_type"];
export type ExpenseTableRow = DatabaseType["expense"];
export type ExpenseTypeTableRow = DatabaseType["expense_type"];
export type CurrencyTableRow = DatabaseType["currency"];
export type ServiceLogTableRow = DatabaseType["service_log"];
export type ServiceTypeTableRow = DatabaseType["service_type"];
export type ServiceItemTableRow = DatabaseType["service_item"];
export type ServiceItemTypeTableRow = DatabaseType["service_item_type"];
export type RideLogTableRow = DatabaseType["ride_log"];
export type RideExpenseTableRow = DatabaseType["ride_expense"];
export type RidePlaceTableRow = DatabaseType["ride_place"];
export type RidePassengerTableRow = DatabaseType["ride_passenger"];
export type PlaceTableRow = DatabaseType["place"];
export type PassengerTableRow = DatabaseType["passenger"];