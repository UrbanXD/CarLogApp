import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RideExpenseTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { RideExpense, rideExpenseSchema } from "../../schemas/rideExpenseSchema.ts";
import { ExpenseDao } from "../../../../../expense/model/dao/ExpenseDao.ts";
import { RideExpenseFormFields, RideExpenseFormTransformedFields } from "../../schemas/form/rideExpenseForm.ts";
import { CurrencyDao } from "../../../../../_shared/currency/model/dao/CurrencyDao.ts";
import { ExpenseTypeDao } from "../../../../../expense/model/dao/ExpenseTypeDao.ts";
import { WithPrefix } from "../../../../../../types";
import { SelectExpenseTableRow } from "../../../../../expense/model/mapper/expenseMapper.ts";
import { Car } from "../../../../../car/schemas/carSchema.ts";

export type SelectRideExpenseTableRow =
    RideExpenseTableRow
    & WithPrefix<Omit<SelectExpenseTableRow, "id" | "related_id">, "expense">;

export class RideExpenseMapper extends AbstractMapper<RideExpenseTableRow, RideExpense, SelectRideExpenseTableRow> {
    private readonly expenseDao: ExpenseDao;
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly currencyDao: CurrencyDao;

    constructor(expenseDao: ExpenseDao, expenseTypeDao: ExpenseTypeDao, currencyDao: CurrencyDao) {
        super();
        this.expenseDao = expenseDao;
        this.expenseTypeDao = expenseTypeDao;
        this.currencyDao = currencyDao;
    }

    toDto(entity: SelectRideExpenseTableRow): RideExpense {
        const expense = this.expenseDao.mapper.toDto({
            id: entity.expense_id!,
            car_id: entity.expense_car_id,
            car_name: entity.expense_car_name,
            car_model_id: entity.expense_car_model_id,
            car_model_name: entity.expense_car_model_name,
            car_model_year: entity.expense_car_model_year,
            car_make_id: entity.expense_car_make_id,
            car_make_name: entity.expense_car_make_name,
            related_id: null,
            type_id: entity.expense_type_id,
            type_owner_id: entity.expense_type_owner_id,
            type_key: entity.expense_type_key,
            exchange_rate: entity.expense_exchange_rate,
            amount: entity.expense_amount,
            original_amount: entity.expense_original_amount,
            currency_id: entity.expense_currency_id,
            currency_key: entity.expense_currency_key,
            currency_symbol: entity.expense_currency_symbol,
            car_currency_id: entity.expense_car_currency_id,
            car_currency_key: entity.expense_car_currency_key,
            car_currency_symbol: entity.expense_car_currency_symbol,
            date: entity.expense_date,
            note: entity.expense_note
        });

        return rideExpenseSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            expense: expense
        });
    }

    toEntity(dto: RideExpense): RideExpenseTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            expense_id: dto?.expense?.id
        };
    }

    async toFormTransformedFields(
        formResult: RideExpenseFormFields,
        car: Car
    ): Promise<RideExpenseFormTransformedFields> {
        const expenseEntity = this.expenseDao.mapper.formResultToEntity({
            id: formResult.expense.id,
            carId: car.id,
            typeId: formResult.typeId,
            expense: formResult.expense,
            date: formResult.date,
            note: formResult.note
        });

        const expenseType = await this.expenseTypeDao.getById(expenseEntity.type_id);
        const currency = await this.currencyDao.getById(expenseEntity.currency_id);
        const carCurrency = await this.currencyDao.getById(car.currency.id);

        return {
            id: formResult.id,
            expense: this.expenseDao.mapper.toDto({
                ...expenseEntity,
                car_name: car.name,
                car_model_id: car.model.id,
                car_model_name: car.model.name,
                car_model_year: car.model.year,
                car_make_id: car.model.make.id,
                car_make_name: car.model.make.name,
                type_id: expenseType.id,
                type_owner_id: expenseType.ownerId,
                type_key: expenseType.key,
                related_id: null,
                car_currency_id: carCurrency.id as never,
                car_currency_key: carCurrency.key,
                car_currency_symbol: carCurrency.symbol,
                currency_id: currency.id as never,
                currency_key: currency.key,
                currency_symbol: currency.symbol
            })
        };
    }
}