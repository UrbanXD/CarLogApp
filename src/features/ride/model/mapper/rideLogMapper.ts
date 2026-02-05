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
import { RideLog, rideLogSchema } from "../../schemas/rideLogSchema.ts";
import { RideLogFormFields } from "../../schemas/form/rideLogForm.ts";
import { OdometerLogTypeEnum } from "../../../car/_features/odometer/model/enums/odometerLogTypeEnum.ts";
import { SelectRideLogTableRow, SelectTimelineRideLogTableRow } from "../dao/rideLogDao.ts";
import { RideExpenseMapper } from "../../_features/rideExpense/model/mapper/rideExpenseMapper.ts";
import { RidePlaceMapper } from "../../_features/place/model/mapper/ridePlaceMapper.ts";
import { RidePassengerMapper } from "../../_features/passenger/model/mapper/ridePassengerMapper.ts";
import { carSimpleSchema } from "../../../car/schemas/carSchema.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { MAX_EXCHANGE_RATE_DECIMAL } from "../../../../constants";

export class RideLogMapper extends AbstractMapper<RideLogTableRow, RideLog> {
    private readonly rideExpenseMapper: RideExpenseMapper;
    private readonly ridePlaceMapper: RidePlaceMapper;
    private readonly ridePassengerMapper: RidePassengerMapper;
    private readonly odometerLogDao: OdometerLogDao;
    private readonly odometerUnitDao: OdometerUnitDao;
    private readonly carDao: CarDao;

    constructor(
        rideExpenseMapper: RideExpenseMapper,
        ridePlaceMapper: RidePlaceMapper,
        ridePassengerMapper: RidePassengerMapper,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao,
        carDao: CarDao
    ) {
        super();

        this.rideExpenseMapper = rideExpenseMapper;
        this.ridePlaceMapper = ridePlaceMapper;
        this.ridePassengerMapper = ridePassengerMapper;
        this.odometerLogDao = odometerLogDao;
        this.odometerUnitDao = odometerUnitDao;
        this.carDao = carDao;
    }

    toDto(entity: SelectRideLogTableRow): RideLog {
        const car = carSimpleSchema.parse({
            id: entity.car_id,
            name: entity.car_name,
            model: {
                id: entity.car_model_id,
                name: entity.car_model_name,
                year: entity.car_model_year,
                make: {
                    id: entity.car_make_id,
                    name: entity.car_make_name
                }
            },
            currency: {
                id: entity.car_currency_id,
                key: entity.car_currency_key,
                symbol: entity.car_currency_symbol
            }
        });

        const rideExpenses = this.rideExpenseMapper.toDtoArray(entity.expenses);
        const ridePlaces = this.ridePlaceMapper.toDtoArray(entity.places);
        const ridePassengers = this.ridePassengerMapper.toDtoArray(entity.passengers);
        const startOdometer = this.odometerLogDao.mapper.toOdometerDto({
            log_id: entity.start_odometer_log_id,
            log_car_id: entity.car_id,
            log_value: Math.round(entity.start_odometer_log_value ?? 0),
            unit_id: entity.odometer_unit_id,
            unit_key: entity.odometer_unit_key,
            unit_short: entity.odometer_unit_short,
            unit_conversion_factor: entity.odometer_unit_conversion_factor
        });
        const endOdometer = this.odometerLogDao.mapper.toOdometerDto({
            log_id: entity.end_odometer_log_id,
            log_car_id: entity.car_id,
            log_value: Math.round(entity.end_odometer_log_value ?? 0),
            unit_id: entity.odometer_unit_id,
            unit_key: entity.odometer_unit_key,
            unit_short: entity.odometer_unit_short,
            unit_conversion_factor: entity.odometer_unit_conversion_factor
        });

        return rideLogSchema.parse({
            id: entity.id,
            car: car,
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

    timelineEntityToDto(entity: SelectTimelineRideLogTableRow): RideLog {
        return this.toDto({ ...entity, places: [], expenses: [], passengers: [] });
    }

    toEntity(dto: RideLog): RideLogTableRow {
        return {
            id: dto.id,
            car_id: dto.car.id,
            start_odometer_log_id: dto.startOdometer?.id ?? null,
            end_odometer_log_id: dto.endOdometer?.id ?? null,
            start_time: dto.startTime,
            end_time: dto.endTime,
            note: dto.note
        };
    }

    async formResultToEntities(formResult: RideLogFormFields): Promise<{
        rideLog: RideLogTableRow,
        expenses: Map<string, ExpenseTableRow>,
        rideExpenses: Map<string, RideExpenseTableRow>,
        ridePlaces: Map<string, RidePlaceTableRow>,
        ridePassengers: Map<string, RidePassengerTableRow>,
        startOdometerLog: OdometerLogTableRow,
        endOdometerLog: OdometerLogTableRow
    }> {
        const [ownerId, odometerUnit] = await Promise.all([
            (async () => this.carDao.getCarOwnerById(formResult.carId))(),
            (async () => this.odometerUnitDao.getUnitByCarId(formResult.carId))()
        ]);

        const startOdometerLog: OdometerLogTableRow = {
            id: formResult.startOdometerLogId,
            car_id: formResult.carId,
            type_id: OdometerLogTypeEnum.RIDE,
            value: Math.round(formResult.startOdometerValue * odometerUnit.conversionFactor)
        };

        const endOdometerLog: OdometerLogTableRow = {
            id: formResult.endOdometerLogId,
            car_id: formResult.carId,
            type_id: OdometerLogTypeEnum.RIDE,
            value: Math.round(formResult.endOdometerValue * odometerUnit.conversionFactor)
        };

        const rideLog: RideLogTableRow = {
            id: formResult.id,
            car_id: formResult.carId,
            start_odometer_log_id: startOdometerLog.id,
            end_odometer_log_id: endOdometerLog.id,
            start_time: formResult.startTime,
            end_time: formResult.endTime,
            note: formResult.note
        };

        const rideExpenses = new Map<string, RideExpenseTableRow>();
        const expenses = new Map<string, ExpenseTableRow>();

        for(const item of formResult.expenses) {
            rideExpenses.set(item.id, {
                id: item.id,
                owner_id: ownerId,
                ride_log_id: formResult.id,
                expense_id: item.expense.id
            });

            expenses.set(item.expense.id, {
                id: item.expense.id,
                car_id: formResult.carId,
                type_id: item.expense.type.id,
                currency_id: item.expense.amount.currency.id,
                amount: numberToFractionDigit(item.expense.amount.amount),
                exchange_rate: numberToFractionDigit(item.expense.amount.exchangeRate, MAX_EXCHANGE_RATE_DECIMAL),
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
                owner_id: ownerId,
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
                owner_id: ownerId,
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