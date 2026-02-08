import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import {
    ExpenseTableRow,
    FuelLogTableRow,
    OdometerLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog, fuelLogSchema } from "../../schemas/fuelLogSchema.ts";
import { FuelUnitDao } from "../dao/FuelUnitDao.ts";
import { FuelLogFormFields } from "../../schemas/form/fuelLogForm.ts";
import { ExpenseTypeEnum } from "../../../../../expense/model/enums/ExpenseTypeEnum.ts";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { OdometerLogDao } from "../../../odometer/model/dao/OdometerLogDao.ts";
import { OdometerLogTypeEnum } from "../../../odometer/model/enums/odometerLogTypeEnum.ts";
import { OdometerUnitDao } from "../../../odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";
import { FuelConsumptionResult, FuelCostPerDistanceResult, SelectFuelLogTableRow } from "../dao/FuelLogDao.ts";
import { carSimpleSchema } from "../../../../schemas/carSchema.ts";
import { LineChartStatistics } from "../../../../../../database/dao/types/statistics.ts";
import { LineChartItem } from "../../../../../statistics/components/charts/LineChartView.tsx";
import { MAX_EXCHANGE_RATE_DECIMAL } from "../../../../../../constants";

export class FuelLogMapper extends AbstractMapper<FuelLogTableRow, FuelLog> {
    private readonly fuelUnitDao: FuelUnitDao;
    private readonly expenseDao: ExpenseDao;
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly odometerLogDao: OdometerLogDao;
    private readonly odometerUnitDao: OdometerUnitDao;

    constructor(
        fuelUnitDao: FuelUnitDao,
        expenseDao: ExpenseDao,
        expenseTypeDao: ExpenseTypeDao,
        odometerLogDao: OdometerLogDao,
        odometerUnitDao: OdometerUnitDao
    ) {
        super();
        this.fuelUnitDao = fuelUnitDao;
        this.expenseDao = expenseDao;
        this.expenseTypeDao = expenseTypeDao;
        this.odometerLogDao = odometerLogDao;
        this.odometerUnitDao = odometerUnitDao;
    }

    toDto(entity: SelectFuelLogTableRow): FuelLog {
        const isPricePerUnit = Boolean(entity.is_price_per_unit!);

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
                id: entity.expense_car_currency_id,
                key: entity.expense_car_currency_key,
                symbol: entity.expense_car_currency_symbol
            }
        });

        const odometer =
            entity.odometer_log_id
            ? this.odometerLogDao.mapper.toOdometerDto({
                log_id: entity.odometer_log_id,
                log_car_id: entity.car_id,
                log_value: entity.odometer_log_value,
                unit_id: entity.odometer_unit_id!,
                unit_key: entity.odometer_unit_key,
                unit_short: entity.odometer_unit_short,
                unit_conversion_factor: entity.odometer_unit_conversion_factor
            })
            : null;

        const expense = this.expenseDao.mapper.toDto({
            id: entity.expense_id!,
            car_id: entity.car_id,
            car_name: entity.car_name,
            car_model_id: entity.car_model_id,
            car_model_name: entity.car_model_name,
            car_model_year: entity.car_model_year,
            car_make_id: entity.car_make_id,
            car_make_name: entity.car_make_name,
            related_id: entity.id,
            type_id: entity.expense_type_id,
            type_owner_id: entity.expense_type_owner_id,
            type_key: entity.expense_type_key,
            exchange_rate: numberToFractionDigit(entity.expense_exchange_rate ?? 1, MAX_EXCHANGE_RATE_DECIMAL),
            amount: numberToFractionDigit(entity.expense_amount ?? 0),
            exchanged_amount: numberToFractionDigit(entity.expense_exchanged_amount ?? 0),
            currency_id: entity.expense_currency_id,
            currency_key: entity.expense_currency_key,
            currency_symbol: entity.expense_currency_symbol,
            car_currency_id: entity.expense_car_currency_id,
            car_currency_key: entity.expense_car_currency_key,
            car_currency_symbol: entity.expense_car_currency_symbol,
            date: entity.expense_date,
            note: entity.expense_note
        });

        return fuelLogSchema.parse({
            id: entity.id,
            car: car,
            expense: expense,
            fuelUnit: {
                id: entity.fuel_unit_id,
                key: entity.fuel_unit_key,
                short: entity.fuel_unit_short,
                conversionFactor: entity.fuel_unit_conversion_factor
            },
            odometer: odometer,
            quantity: numberToFractionDigit(entity.quantity ?? 0),
            pricePerUnit: !entity.quantity ? 0 : numberToFractionDigit(expense.amount.amount / entity.quantity),
            exchangedPricePerUnit: !entity.quantity
                                   ? 0
                                   : numberToFractionDigit(expense.amount.exchangedAmount / entity.quantity),
            isPricePerUnit
        });
    }

    toEntity(dto: FuelLog): FuelLogTableRow {
        return {
            id: dto.id,
            car_id: dto.car.id,
            expense_id: dto.expense.id,
            fuel_unit_id: dto.fuelUnit.id,
            odometer_log_id: dto.odometer?.id ?? null,
            quantity: dto.quantity * dto.fuelUnit.conversionFactor,
            is_price_per_unit: dto.isPricePerUnit ? 1 : 0
        };
    }

    fuelConsumptionToLineChartStatistics(entities: Array<FuelConsumptionResult>): LineChartStatistics {
        const chartData: Array<LineChartItem> = entities.map((entity) => ({
            value: entity.value,
            label: entity.date ?? undefined
        }));

        return { chartData };
    }

    fuelCostPerDistanceToLineChartStatistics(entities: Array<FuelCostPerDistanceResult>): LineChartStatistics {
        const chartData: Array<LineChartItem> = entities.map((entity) => ({
            value: entity.value,
            label: entity.date ?? undefined
        }));

        return { chartData };
    }

    async formResultToEntities(formResult: FuelLogFormFields): Promise<{
        fuelLog: FuelLogTableRow,
        expense: ExpenseTableRow,
        odometerLog: OdometerLogTableRow | null
    }> {
        const [fuelUnit, odometerUnit, expenseTypeId] = await Promise.all([
            this.fuelUnitDao.getById(formResult.fuelUnitId),
            this.odometerUnitDao.getUnitByCarId(formResult.carId),
            this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.FUEL)
        ]);

        const amount = formResult.expense.amount * (formResult.expense.isPricePerUnit
                                                    ? formResult.quantity * fuelUnit.conversionFactor
                                                    : 1);

        const expense: ExpenseTableRow = {
            id: formResult.expense.id,
            car_id: formResult.carId,
            type_id: expenseTypeId,
            currency_id: formResult.expense.currencyId,
            exchange_rate: formResult.expense.exchangeRate,
            amount: numberToFractionDigit(amount),
            note: formResult.note,
            date: formResult.date
        };

        const fuelLog: FuelLogTableRow = {
            id: formResult.id,
            car_id: formResult.carId,
            expense_id: formResult.expense.id,
            odometer_log_id: !!formResult?.odometerValue ? formResult.odometerLogId : null,
            fuel_unit_id: formResult.fuelUnitId,
            quantity: numberToFractionDigit(formResult.quantity * (fuelUnit?.conversionFactor ?? 1)),
            is_price_per_unit: Number(formResult.expense.isPricePerUnit) // because of sqllite
        };

        let odometerLog: OdometerLogTableRow | null = null;
        if(!!formResult?.odometerValue) {
            odometerLog = {
                id: formResult.odometerLogId,
                car_id: formResult.carId,
                type_id: OdometerLogTypeEnum.FUEL,
                value: Math.round(formResult.odometerValue * odometerUnit.conversionFactor)
            };
        }

        return { fuelLog, expense, odometerLog: odometerLog };
    }
}