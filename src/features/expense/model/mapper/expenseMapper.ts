import {
    CurrencyTableRow,
    ExpenseTableRow,
    ExpenseTypeTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { ExpenseFormFields } from "../../schemas/form/expenseForm.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { amountSchema } from "../../../_shared/currency/schemas/amountSchema.ts";
import { WithPrefix } from "../../../../types";

export type SelectAmountCurrencyTableRow =
    WithPrefix<CurrencyTableRow, "currency"> &
    WithPrefix<CurrencyTableRow, "car_currency">;

export type SelectExpenseTableRow =
    ExpenseTableRow &
    Omit<SelectAmountCurrencyTableRow, "currency_id"> &
    WithPrefix<ExpenseTypeTableRow, "type"> &
    { related_id: string | null }

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense, SelectExpenseTableRow> {
    private readonly expenseTypeDao: ExpenseTypeDao;

    constructor(expenseTypeDao: ExpenseTypeDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
    }

    toDto(entity: SelectExpenseTableRow): Expense {
        return expenseSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            relatedId: entity?.related_id ?? null,
            type: this.expenseTypeDao.mapper.toDto({
                id: entity.type_id,
                owner_id: entity.type_owner_id,
                key: entity.type_key
            }),
            amount: amountSchema.parse({
                amount: numberToFractionDigit(entity.original_amount ?? 0),
                exchangedAmount: numberToFractionDigit((entity.original_amount ?? 0) * (entity.exchange_rate ?? 0)),
                exchangeRate: numberToFractionDigit(entity.exchange_rate ?? 0),
                currency: currencySchema.parse({
                    id: entity.currency_id,
                    key: entity.currency_key,
                    symbol: entity.currency_symbol
                }),
                exchangeCurrency: currencySchema.parse({
                    id: entity.car_currency_id,
                    key: entity.car_currency_key,
                    symbol: entity.car_currency_symbol
                })
            }),
            note: entity.note,
            date: entity.date
        });
    }

    toEntity(dto: Expense): ExpenseTableRow {
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

    formResultToEntity(formResult: ExpenseFormFields): ExpenseTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type_id: formResult.typeId,
            currency_id: formResult.expense.currencyId,
            amount: numberToFractionDigit(formResult.expense.amount * formResult.expense.exchangeRate),
            original_amount: formResult.expense.amount,
            exchange_rate: formResult.expense.exchangeRate,
            note: formResult.note,
            date: formResult.date
        };
    }
}