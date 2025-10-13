import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ExpenseTableRow, FuelLogTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelLog, fuelLogSchema } from "../../schemas/fuelLogSchema.ts";
import { FuelUnitDao } from "../dao/FuelUnitDao.ts";
import { CarDao } from "../../../../model/dao/CarDao.ts";
import { convertOdometerValueFromKilometer } from "../../../odometer/utils/convertOdometerUnit.ts";
import { FuelLogFields } from "../../schemas/form/fuelLogForm.ts";
import { getUUID } from "../../../../../../database/utils/uuid.ts";
import { ExpenseTypeEnum } from "../../../../../expense/model/enums/ExpenseTypeEnum.ts";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { odometerSchema } from "../../../odometer/schemas/odometerSchema.ts";

export class FuelLogMapper extends AbstractMapper<FuelLogTableRow, FuelLog> {
    private readonly fuelUnitDao: FuelUnitDao;
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly carDao: CarDao;

    constructor(fuelUnitDao: FuelUnitDao, expenseTypeDao: ExpenseTypeDao, carDao: CarDao) {
        super();
        this.fuelUnitDao = fuelUnitDao;
        this.expenseTypeDao = expenseTypeDao;
        this.carDao = carDao;
    }

    async toDto(entity: FuelLogTableRow & Pick<ExpenseTableRow, "car_id" | "original_amount" | "amount">): Promise<FuelLog> {
        const car = await this.carDao.getById(entity.car_id);

        return fuelLogSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            expenseId: entity.expense_id,
            fuelUnit: await this.fuelUnitDao.getById(entity.fuel_unit_id),
            odometer: odometerSchema.parse({
                valueInKm: entity.odometer_value,
                value: convertOdometerValueFromKilometer(
                    entity.odometer_value,
                    car?.odometer.unit.conversionFactor ?? 1
                ),
                unit: car?.odometer.unit
            }),
            quantity: entity.quantity,
            originalPricePerUnit: Number((entity.original_amount / entity.quantity).toFixed(2)),
            pricePerUnit: Number((entity.amount / entity.quantity).toFixed(2))
        });
    }

    async toEntity(dto: FuelLog): Promise<FuelLogTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            expense_id: dto.expense.id,
            fuel_unit_id: dto.fuelUnit.id,
            odometer_value: convertOdometerValueFromKilometer(dto.odometer.value, dto.odometer.unit.conversionFactor),
            quantity: dto.quantity
        };
    }

    async formResultToEntities(formResult: FuelLogFields): Promise<{
        fuelLog: FuelLogTableRow,
        expense: ExpenseTableRow
    }> {
        const expenseId = getUUID();
        const expenseTypeId = await this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.FUEL);

        const expense: ExpenseTableRow = {
            id: expenseId,
            car_id: formResult.carId,
            type_id: expenseTypeId,
            currency_id: formResult.currencyId,
            original_amount: formResult.amount,
            exchange_rate: formResult.exchangeRate,
            amount: formResult.amount * formResult.exchangeRate,
            note: formResult.note,
            date: formResult.date
        };

        const fuelLog: FuelLogTableRow = {
            id: formResult.id,
            owner_id: formResult.ownerId,
            expense_id: expenseId,
            fuel_unit_id: formResult.fuelUnitId,
            odometer_value: formResult.odometerValue,
            quantity: formResult.quantity
        };

        return { fuelLog, expense };
    }
}