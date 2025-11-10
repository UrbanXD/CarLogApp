import { CarTableRow, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";
import { ExpenseType } from "../../schemas/expenseTypeSchema.ts";
import { Currency } from "../../../_shared/currency/schemas/currencySchema.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { amountSchema } from "../../../_shared/currency/schemas/amountSchema.ts";

export type SelectExpenseTableRow = ExpenseTableRow & {
    related_id: string,
    car_currency_id: CarTableRow["currency_id"]
}

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense, SelectExpenseTableRow> {
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly currencyDao: CurrencyDao;

    constructor(expenseTypeDao: ExpenseTypeDao, currencyDao: CurrencyDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
        this.currencyDao = currencyDao;
    }

    async toDto(entity: SelectExpenseTableRow): Promise<Expense> {
        const [type, carCurrency, currency]: [ExpenseType | null, Currency | null, Currency | null] = await Promise.all(
            [
                this.expenseTypeDao.getById(entity.type_id),
                this.currencyDao.getById(entity.car_currency_id),
                this.currencyDao.getById(entity.currency_id)
            ]);

        return expenseSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            relatedId: entity?.related_id ?? null,
            type: type,
            amount: amountSchema.parse({
                amount: numberToFractionDigit(entity.original_amount),
                exchangedAmount: numberToFractionDigit(entity.original_amount * entity.exchange_rate),
                exchangeRate: numberToFractionDigit(entity.exchange_rate),
                currency: currency,
                exchangeCurrency: carCurrency
            }),
            note: entity.note,
            date: entity.date
        });
    }

    async toEntity(dto: Expense): Promise<ExpenseTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            type_id: dto.type.id,
            currency_id: dto.amount.exchangeCurrency.id,
            amount: dto.amount.exchangedAmount,
            original_amount: dto.amount.amount,
            exchange_rate: dto.amount.exchangeRate,
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
            amount: numberToFractionDigit(formResult.amount * formResult.exchangeRate),
            original_amount: formResult.amount,
            exchange_rate: formResult.exchangeRate,
            note: formResult.note,
            date: formResult.date
        };
    }
}