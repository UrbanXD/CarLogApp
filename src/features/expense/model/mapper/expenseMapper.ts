import { ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense> {
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly currencyDao: CurrencyDao;

    constructor(expenseTypeDao: ExpenseTypeDao, currencyDao: CurrencyDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
        this.currencyDao = currencyDao;
    }

    async toDto(entity: ExpenseTableRow): Promise<Expense> {
        return expenseSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            type: await this.expenseTypeDao.getById(entity.type_id),
            currency: await this.currencyDao.getById(entity.currency_id),
            amount: entity.amount,
            exchangeRate: entity.exchange_rate,
            note: entity.note,
            date: entity.date
        });
    }

    async toEntity(dto: Expense): Promise<ExpenseTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            type_id: dto.type.id,
            currency_id: dto.currency.id,
            amount: dto.amount,
            exchange_rate: dto.exchangeRate,
            note: dto.note,
            date: dto.date
        };
    }
}