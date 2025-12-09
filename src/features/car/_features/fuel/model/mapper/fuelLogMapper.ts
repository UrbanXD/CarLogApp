import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import {
    ExpenseTableRow,
    FuelLogTableRow,
    OdometerLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog, fuelLogSchema } from "../../schemas/fuelLogSchema.ts";
import { FuelUnitDao } from "../dao/FuelUnitDao.ts";
import { convertOdometerValueToKilometer } from "../../../odometer/utils/convertOdometerUnit.ts";
import { FuelLogFields } from "../../schemas/form/fuelLogForm.ts";
import { ExpenseTypeEnum } from "../../../../../expense/model/enums/ExpenseTypeEnum.ts";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { Odometer } from "../../../odometer/schemas/odometerSchema.ts";
import { FuelUnit } from "../../schemas/fuelUnitSchema.ts";
import { OdometerLogDao } from "../../../odometer/model/dao/OdometerLogDao.ts";
import { OdometerLogTypeEnum } from "../../../odometer/model/enums/odometerLogTypeEnum.ts";
import { OdometerUnitDao } from "../../../odometer/model/dao/OdometerUnitDao.ts";
import { Expense } from "../../../../../expense/schemas/expenseSchema.ts";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";

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

    async toDto(entity: FuelLogTableRow): Promise<FuelLog> {
        const [fuelUnit, odometer, expense]: [FuelUnit | null, Odometer | null, Expense | null] = await Promise.all([
            this.fuelUnitDao.getById(entity.fuel_unit_id),
            (async () => {
                if(!entity.odometer_log_id) return null;
                return this.odometerLogDao.getOdometerByLogId(entity.odometer_log_id, entity.car_id);
            })(),
            this.expenseDao.getById(entity.expense_id)
        ]);

        if(!expense) throw new Error("Expense not found!");

        const isPricePerUnit = Boolean(entity.is_price_per_unit);
        const quantity = numberToFractionDigit(entity.quantity / (fuelUnit?.conversionFactor ?? 1));

        return fuelLogSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            expense: expense,
            fuelUnit: fuelUnit,
            odometer: odometer,
            quantity: quantity,
            originalPricePerUnit: numberToFractionDigit(expense.amount.amount / quantity),
            pricePerUnit: numberToFractionDigit(expense.amount.exchangedAmount / quantity),
            isPricePerUnit
        });
    }

    async toEntity(dto: FuelLog): Promise<FuelLogTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            expense_id: dto.expense.id,
            fuel_unit_id: dto.fuelUnit.id,
            odometer_log_id: dto.odometer?.id ?? null,
            quantity: dto.quantity * dto.fuelUnit.conversionFactor,
            is_price_per_unit: dto.isPricePerUnit
        };
    }

    async formResultToEntities(formResult: FuelLogFields): Promise<{
        fuelLog: FuelLogTableRow,
        expense: ExpenseTableRow,
        odometerLog: OdometerLogTableRow | null
    }> {
        const fuelUnit = await this.fuelUnitDao.getById(formResult.fuelUnitId);
        const odometerUnit = await this.odometerUnitDao.getUnitByCarId(formResult.carId);
        const expenseTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.FUEL);

        const originalAmount = numberToFractionDigit(formResult.amount * (formResult.isPricePerUnit
                                                                          ? formResult.quantity
                                                                          : 1));
        const amount = numberToFractionDigit(originalAmount * formResult.exchangeRate);

        const expense: ExpenseTableRow = {
            id: formResult.expenseId,
            car_id: formResult.carId,
            type_id: expenseTypeId,
            currency_id: formResult.currencyId,
            original_amount: originalAmount,
            exchange_rate: formResult.exchangeRate,
            amount: amount,
            note: formResult.note,
            date: formResult.date
        };

        const fuelLog: FuelLogTableRow = {
            id: formResult.id,
            owner_id: formResult.ownerId,
            expense_id: formResult.expenseId,
            odometer_log_id: !!formResult?.odometerValue ? formResult.odometerLogId : null,
            fuel_unit_id: formResult.fuelUnitId,
            quantity: formResult.quantity * (fuelUnit?.conversionFactor ?? 1),
            is_price_per_unit: Number(formResult.isPricePerUnit) // because of sqllite
        };

        let odometerLog: OdometerLogTableRow | null = null;
        if(!!formResult?.odometerValue) {
            odometerLog = {
                id: formResult.odometerLogId,
                car_id: formResult.carId,
                type_id: OdometerLogTypeEnum.FUEL,
                value: convertOdometerValueToKilometer(formResult.odometerValue, odometerUnit.conversionFactor)
            };
        }

        return { fuelLog, expense, odometerLog: odometerLog };
    }
}