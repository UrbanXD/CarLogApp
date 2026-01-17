import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RideExpenseTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { RideExpense, rideExpenseSchema } from "../../schemas/rideExpenseSchema.ts";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { RideExpenseFormFields, RideExpenseFormTransformedFields } from "../../schemas/form/rideExpenseForm.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";

export class RideExpenseMapper extends AbstractMapper<RideExpenseTableRow, RideExpense> {
    private readonly carDao: CarDao;
    private readonly expenseDao: ExpenseDao;

    constructor(carDao: CarDao, expenseDao: ExpenseDao) {
        super();

        this.carDao = carDao;
        this.expenseDao = expenseDao;
    }

    async toDto(entity: RideExpenseTableRow): Promise<RideExpense> {
        const expense = await this.expenseDao.getById(entity.expense_id);

        return rideExpenseSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            expense: expense
        });
    }

    async toEntity(dto: RideExpense): Promise<RideExpenseTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            expense_id: dto?.expense?.id
        };
    }

    async formResultMapper(
        formResult: RideExpenseFormFields,
        carId: string
    ): Promise<RideExpenseFormTransformedFields> {
        const carCurrencyId = await this.carDao.getCarCurrencyIdById(carId);

        const expenseEntity = this.expenseDao.mapper.formResultToEntity({
            id: formResult.expense.id,
            carId: carId,
            typeId: formResult.typeId,
            expense: formResult.expense,
            date: formResult.date,
            note: formResult.note
        });

        return {
            id: formResult.id,
            expense: await this.expenseDao.mapper.toDto({
                ...expenseEntity,
                related_id: null,
                car_currency_id: carCurrencyId
            })
        };
    }
}