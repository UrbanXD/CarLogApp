import { ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";
import { FuelLogDao } from "../../../car/_features/fuel/model/dao/FuelLogDao.ts";

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense> {
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly currencyDao: CurrencyDao;
    private readonly fuelLogDao: FuelLogDao;

    constructor(expenseTypeDao: ExpenseTypeDao, currencyDao: CurrencyDao, fuelLogDao: FuelLogDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
        this.currencyDao = currencyDao;
        this.fuelLogDao = fuelLogDao;
    }

    async toDto(entity: ExpenseTableRow): Promise<Expense> {
        return expenseSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            type: await this.expenseTypeDao.getById(entity.type_id),
            currency: await this.currencyDao.getById(entity.currency_id),
            originalAmount: entity.original_amount,
            exchangeRate: entity.exchange_rate,
            amount: entity.amount,
            note: entity.note,
            date: entity.date,
            fuelLog: await this.fuelLogDao.getByExpenseId(entity.id, false) ?? null
        });
    }

    async toEntity(dto: Expense): Promise<ExpenseTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            type_id: dto.type.id,
            currency_id: dto.currency.id,
            original_amount: dto.originalAmount,
            exchange_rate: dto.exchangeRate,
            amount: dto.amount,
            note: dto.note,
            date: dto.date
        };
    }

    formResultToEntity(formResult: ExpenseFields): ExpenseTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type_id: formResult.typeId,
            currency_id: formResult.currencyId,
            original_amount: formResult.amount,
            exchange_rate: formResult.exchangeRate,
            amount: formResult.amount * formResult.exchangeRate,
            note: formResult.note,
            date: formResult.date
        };
    }
}