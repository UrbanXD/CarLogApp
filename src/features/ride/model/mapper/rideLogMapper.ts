import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import {
    ExpenseTableRow,
    OdometerLogTableRow,
    RideExpenseTableRow,
    RideLogTableRow,
    RidePassengerTableRow,
    RidePlaceTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { OdometerLogDao } from "../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerUnitDao } from "../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { CarDao } from "../../../car/model/dao/CarDao.ts";
import { Odometer } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { RideLog, rideLogSchema } from "../../schemas/rideLogSchema.ts";
import { RidePassengerDao } from "../../_features/passenger/model/dao/ridePassengerDao.ts";
import { RidePlaceDao } from "../../_features/place/model/dao/ridePlaceDao.ts";
import { RideExpenseDao } from "../../_features/rideExpense/model/dao/rideExpenseDao.ts";
import { RideExpense } from "../../_features/rideExpense/schemas/rideExpenseSchema.ts";
import { RidePlace } from "../../_features/place/schemas/ridePlaceSchema.ts";
import { RidePassenger } from "../../_features/passenger/schemas/ridePassengerSchema.ts";
import { RideLogFormFields } from "../../schemas/form/rideLogForm.ts";
import { OdometerLogTypeEnum } from "../../../car/_features/odometer/model/enums/odometerLogTypeEnum.ts";

export class RideLogMapper extends AbstractMapper<RideLogTableRow, RideLog> {
    private readonly rideExpenseDao: RideExpenseDao;
    private readonly ridePlaceDao: RidePlaceDao;
    private readonly ridePassengerDao: RidePassengerDao;
    private readonly odometerLogDao: OdometerLogDao;
    private readonly odometerUnitDao: OdometerUnitDao;
    private readonly carDao: CarDao;

    constructor(
        rideExpenseDao: RideExpenseDao,
        ridePlaceDao: RidePlaceDao,
        ridePassengerDao: RidePassengerDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao,
        carDao: CarDao
    ) {
        super();

        this.rideExpenseDao = rideExpenseDao;
        this.ridePlaceDao = ridePlaceDao;
        this.ridePassengerDao = ridePassengerDao;
        this.odometerLogDao = odometerLogDao;
        this.odometerUnitDao = odometerUnitDao;
        this.carDao = carDao;
    }

    async toDto(entity: RideLogTableRow): Promise<RideLog> {
        const [rideExpenses, ridePlaces, ridePassengers, startOdometer, endOdometer]: [Array<RideExpense>, Array<RidePlace>, Array<RidePassenger>, Odometer | null, Odometer | null] = await Promise.all(
            [
                (async () => this.rideExpenseDao.getAllByRideLogId(entity.id))(),
                (async () => this.ridePlaceDao.getAllByRideLogId(entity.id))(),
                (async () => this.ridePassengerDao.getAllByRideLogId(entity.id))(),
                (async () => {
                    if(!entity.start_odometer_log_id) return null;
                    return this.odometerLogDao.getOdometerByLogId(entity.start_odometer_log_id, entity.car_id);
                })(),
                (async () => {
                    if(!entity.end_odometer_log_id) return null;
                    return this.odometerLogDao.getOdometerByLogId(entity.end_odometer_log_id, entity.car_id);
                })()
            ]);

        return rideLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            rideExpenses: rideExpenses,
            ridePassengers: ridePassengers,
            ridePlaces: ridePlaces,
            startOdometer: startOdometer,
            endOdometer: endOdometer,
            startTime: entity.start_time,
            endTime: entity.end_time,
            note: entity.note
        });
    }

    async toEntity(dto: RideLog): Promise<RideLogTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            start_odometer_log_id: dto.startOdometer?.id ?? null,
            end_odometer_log_id: dto.endOdometer?.id ?? null,
            start_time: dto.startTime,
            end_time: dto.endTime,
            note: dto.note
        };
    }

    formResultToEntities(formResult: RideLogFormFields): {
        rideLog: RideLogTableRow,
        expenses: Map<string, ExpenseTableRow>,
        rideExpenses: Map<string, RideExpenseTableRow>,
        ridePlaces: Map<string, RidePlaceTableRow>,
        ridePassengers: Map<string, RidePassengerTableRow>,
        startOdometerLog: OdometerLogTableRow | null,
        endOdometerLog: OdometerLogTableRow | null
    } {
        let startOdometerLog: OdometerLogTableRow | null = null;
        if(formResult.startOdometerValue) {
            startOdometerLog = {
                id: formResult.startOdometerLogId,
                car_id: formResult.carId,
                type_id: OdometerLogTypeEnum.SIMPLE,
                value: formResult.startOdometerValue
            };
        }

        let endOdometerLog: OdometerLogTableRow | null = null;
        if(formResult.endOdometerValue) {
            endOdometerLog = {
                id: formResult.endOdometerLogId,
                car_id: formResult.carId,
                type_id: OdometerLogTypeEnum.SIMPLE,
                value: formResult.endOdometerValue
            };
        }

        const rideLog: RideLogTableRow = {
            id: formResult.id,
            car_id: formResult.carId,
            start_odometer_log_id: startOdometerLog?.id ?? null,
            end_odometer_log_id: endOdometerLog?.id ?? null,
            start_time: formResult.startTime,
            end_time: formResult.endTime,
            note: formResult.note
        };

        const rideExpenses = new Map<string, RideExpenseTableRow>();
        const expenses = new Map<string, ExpenseTableRow>();

        for(const item of formResult.expenses) {
            rideExpenses.set(item.id, {
                id: item.id,
                owner_id: formResult.ownerId,
                ride_log_id: formResult.id,
                expense_id: item.expense.id
            });

            expenses.set(item.expense.id, {
                id: item.expense.id,
                car_id: formResult.carId,
                type_id: item.expense.type.id,
                currency_id: item.expense.amount.currency.id,
                original_amount: item.expense.amount.amount,
                amount: item.expense.amount.exchangedAmount,
                exchange_rate: item.expense.amount.exchangeRate,
                note: item.expense.note,
                date: item.expense.date
            });
        }

        const ridePlaces = new Map<string, RidePlaceTableRow>();

        let placeOrder = 0;
        for(const item of formResult.places) {
            placeOrder += 1;
            ridePlaces.set(item.id, {
                id: item.id,
                owner_id: formResult.ownerId,
                place_id: item.placeId,
                ride_log_id: formResult.id,
                place_order: placeOrder
            });
        }

        const ridePassengers = new Map<string, RidePassengerTableRow>();

        let passengerOrder = 0;
        for(const item of formResult.passengers) {
            passengerOrder += 1;
            ridePassengers.set(item.id, {
                id: item.id,
                owner_id: formResult.ownerId,
                passenger_id: item.passengerId,
                ride_log_id: formResult.id,
                passenger_order: passengerOrder
            });
        }

        return {
            rideLog,
            expenses,
            rideExpenses,
            ridePlaces,
            ridePassengers,
            startOdometerLog,
            endOdometerLog
        };
    }
}